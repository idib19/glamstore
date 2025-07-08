'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { appointmentsApi, customersApi } from '../lib/supabase';

interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
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
}

interface AppointmentDetailsProps {
  customerEmail?: string;
  customerPhone?: string;
}

export default function AppointmentDetails({ customerEmail, customerPhone }: AppointmentDetailsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');

  useEffect(() => {
    if (customerEmail) {
      setSearchQuery(customerEmail);
      setSearchType('email');
      searchAppointments(customerEmail, 'email');
    } else if (customerPhone) {
      setSearchQuery(customerPhone);
      setSearchType('phone');
      searchAppointments(customerPhone, 'phone');
    }
  }, [customerEmail, customerPhone]);

  const searchAppointments = async (query: string, type: 'email' | 'phone') => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError('');

      // First, find the customer
      const allCustomers = await customersApi.getAll();
      const customer = allCustomers.find(c => 
        type === 'email' 
          ? c.email.toLowerCase() === query.toLowerCase()
          : c.phone === query
      );

      if (!customer) {
        setError('Aucun client trouvé avec ces informations');
        setAppointments([]);
        return;
      }

      // Then get their appointments
      const allAppointments = await appointmentsApi.getAll();
      const customerAppointments = allAppointments.filter(apt => apt.customer_id === customer.id);
      
      setAppointments(customerAppointments);
    } catch (error) {
      console.error('Error searching appointments:', error);
      setError('Erreur lors de la recherche des rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchAppointments(searchQuery, searchType);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Programmé', color: 'bg-blue-100 text-blue-800', icon: Calendar };
      case 'confirmed':
        return { label: 'Confirmé', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'completed':
        return { label: 'Terminé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle };
      case 'no_show':
        return { label: 'Absent', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Calendar };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Rendez-vous
        </h1>
        <p className="text-gray-600">
          Consultez vos rendez-vous et leur statut
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher par
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'email' | 'phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
              </label>
              <input
                type={searchType === 'email' ? 'email' : 'tel'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'email' ? 'votre@email.com' : '0612345678'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Vos rendez-vous ({appointments.length})
          </h2>
          
          {appointments.map((appointment) => {
            const statusInfo = getStatusInfo(appointment.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-soft-pink rounded-full p-2">
                      <Calendar className="h-5 w-5 text-primary-pink" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.services?.name || 'Service non trouvé'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(appointment.appointment_date)} à {appointment.start_time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informations client
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{appointment.customers?.first_name} {appointment.customers?.last_name}</p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {appointment.customers?.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {appointment.customers?.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Détails du rendez-vous
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Durée :</strong> {appointment.services?.duration_minutes || 30} minutes</p>
                      <p><strong>Prix :</strong> {appointment.total_price}€</p>
                      <p><strong>Heure de fin :</strong> {appointment.end_time}</p>
                      {appointment.deposit_paid && (
                        <p className="text-green-600"><strong>Acompte payé</strong></p>
                      )}
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">Notes :</h4>
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Queen&apos;s Glam - Gatineau</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Appointments Found */}
      {!isLoading && !error && appointments.length === 0 && searchQuery && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-gray-600">
            Aucun rendez-vous n'a été trouvé pour ces informations.
          </p>
        </div>
      )}
    </div>
  );
} 