'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { appointmentsApi, servicesApi, customersApi } from '../lib/supabase';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

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

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onAppointmentUpdated: () => void;
}

export default function EditAppointmentModal({ isOpen, onClose, appointment, onAppointmentUpdated }: EditAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Array<{
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  }>>([]);
  const [customers, setCustomers] = useState<Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }>>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    appointment_date: '',
    start_time: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show',
    notes: '',
    total_price: 0,
    deposit_paid: false
  });

  // Load services and customers
  useEffect(() => {
    if (isOpen) {
      loadServices();
      loadCustomers();
      if (appointment) {
        setFormData({
          customer_id: appointment.customer_id,
          service_id: appointment.service_id,
          appointment_date: appointment.appointment_date,
          start_time: appointment.start_time,
          status: appointment.status as 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show',
          notes: appointment.notes || '',
          total_price: appointment.total_price,
          deposit_paid: appointment.deposit_paid
        });
      }
    }
  }, [isOpen, appointment]);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const checkSlotAvailability = useCallback(async (date: string, startTime: string, durationMinutes: number): Promise<boolean> => {
    try {
      // For editing, we need to exclude the current appointment time
      const result = await appointmentsApi.checkAvailability(date, startTime, durationMinutes);
      
      // If this is the current appointment time, it should be available
      if (appointment && appointment.appointment_date === date && appointment.start_time === startTime) {
        return true;
      }
      
      return result === true;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }, [appointment]);

  const loadAvailableSlots = useCallback(async () => {
    if (!formData.appointment_date || !formData.service_id) {
      setAvailableSlots([]);
      return;
    }

    try {
      setIsLoadingSlots(true);
      const selectedService = services.find(s => s.id === formData.service_id);
      if (!selectedService) return;

      // Generate time slots from 9 AM to 6 PM
      const slots = [];
      const startHour = 9;
      const endHour = 18;
      const interval = 30; // 30 minutes

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if this slot is available
          const isAvailable = await checkSlotAvailability(
            formData.appointment_date,
            timeString,
            selectedService.duration_minutes
          );
          
          if (isAvailable) {
            slots.push(timeString);
          }
        }
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [formData.appointment_date, formData.service_id, services, checkSlotAvailability]);

  useEffect(() => {
    if (formData.appointment_date && formData.service_id) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.appointment_date, formData.service_id, loadAvailableSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    setIsLoading(true);
    try {
      // Calculate end time based on service duration
      const selectedService = services.find(s => s.id === formData.service_id);
      const durationMinutes = selectedService?.duration_minutes || 30;
      
      // Calculate end time (simple calculation - in production you'd want more sophisticated logic)
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      await appointmentsApi.update(appointment.id, {
        customer_id: formData.customer_id,
        service_id: formData.service_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: endTimeString,
        status: formData.status,
        notes: formData.notes || null,
        total_price: formData.total_price,
        deposit_paid: formData.deposit_paid
      });

      onAppointmentUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Erreur lors de la mise à jour du rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const statusOptions = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'no_show', label: 'Absent' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier le Rendez-vous #{appointment.id.slice(0, 8)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informations Client</h3>
              <p className="text-sm text-gray-600">
                {appointment.customers ? 
                  `${appointment.customers.first_name} ${appointment.customers.last_name}` : 
                  'Client non trouvé'
                }
              </p>
              <p className="text-sm text-gray-600">
                {appointment.customers?.email}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.customers?.phone}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Service</h3>
              <p className="text-sm text-gray-600">
                {appointment.services?.name || 'Service non trouvé'}
              </p>
              <p className="text-sm text-gray-600">
                Durée: {appointment.services?.duration_minutes || 30} min
              </p>
              <p className="font-medium text-gray-900">
                Prix: {appointment.total_price}€
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                <option value="">Sélectionner un client</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => {
                  const selectedService = services.find(s => s.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    service_id: e.target.value,
                    total_price: selectedService?.price || 0
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price}€
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                value={formData.appointment_date}
                onChange={(date) => setFormData({ ...formData, appointment_date: date, start_time: '' })}
                placeholder="Sélectionner une date"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              {formData.appointment_date && formData.service_id ? (
                <TimePicker
                  value={formData.start_time}
                  onChange={(time) => setFormData({ ...formData, start_time: time })}
                  availableSlots={availableSlots}
                  isLoading={isLoadingSlots}
                  placeholder="Sélectionner une heure"
                  className="w-full"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
                  Veuillez d&apos;abord sélectionner une date et un service
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix total
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acompte payé
              </label>
              <select
                value={formData.deposit_paid ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, deposit_paid: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              placeholder="Notes optionnelles..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-pink text-white rounded-md hover:bg-dark-pink transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 