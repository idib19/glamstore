'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { appointmentsApi } from '../../lib/supabase';
import ConfirmDialog from '../ConfirmDialog';
import { Database } from '../../types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  services?: {
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  } | null;
};

interface AppointmentsProps {
  onAddAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  refreshTrigger?: number;
}

export default function Appointments({ onAddAppointment, onEditAppointment, refreshTrigger = 0 }: AppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Load appointments data
  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [refreshTrigger]);

  // Appointment actions
  const handleDeleteAppointment = async (appointment: Appointment) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer le rendez-vous',
      message: `Êtes-vous sûr de vouloir supprimer définitivement le rendez-vous #${appointment.id.slice(0, 8)} ? Cette action est irréversible.`,
      onConfirm: async () => {
        setIsDeleting(appointment.id);
        try {
          await appointmentsApi.delete(appointment.id);
          
          await loadAppointments();
          console.log('Appointment deleted successfully');
        } catch (error) {
          console.error('Error deleting appointment:', error);
          alert('Erreur lors de la suppression du rendez-vous');
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'no_show': return 'Absent';
      default: return status;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Rendez-vous</h3>
          <button 
            onClick={onAddAppointment}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Rendez-vous
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
              <span className="ml-2 text-gray-600">Chargement des rendez-vous...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun rendez-vous trouvé
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">RDV #{appointment.id.slice(0, 8)}</h4>
                        <p className="text-sm text-gray-600">
                          Client: {appointment.customers ? 
                            `${appointment.customers.first_name} ${appointment.customers.last_name}` : 
                            'Client non trouvé'
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          Service: {appointment.services?.name || 'Service non trouvé'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.start_time}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEditAppointment(appointment)}
                        className="btn-primary text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteAppointment(appointment)}
                        disabled={isDeleting === appointment.id}
                        className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isDeleting === appointment.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </>
  );
} 