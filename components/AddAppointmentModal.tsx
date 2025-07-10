'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { appointmentsApi, servicesApi, customersApi } from '../lib/supabase';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import type { Database } from '../types/database';

type Service = Database['public']['Tables']['services']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
}

export default function AddAppointmentModal({ isOpen, onClose, onAppointmentAdded }: AddAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    appointment_date: '',
    start_time: '',
    notes: '',
    deposit_paid: false
  });

  useEffect(() => {
    if (isOpen) {
      loadServices();
      loadCustomers();
      // Reset form when opening
      setFormData({
        customer_id: '',
        service_id: '',
        appointment_date: '',
        start_time: '',
        notes: '',
        deposit_paid: false
      });
      setAvailableSlots([]);
    }
  }, [isOpen]);

  const loadAvailableSlots = useCallback(async () => {
    if (!formData.appointment_date || !formData.service_id) return;

    try {
      setIsLoadingSlots(true);
      const selectedService = services.find(s => s.id === formData.service_id);
      if (!selectedService) return;

      const slots: string[] = [];
      
      // Generate time slots for business hours (9 AM to 7 PM)
      for (let hour = 9; hour < 19; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if this slot is available
          const isAvailable = await checkSlotAvailability(formData.appointment_date, timeString, selectedService.duration_minutes);
          if (isAvailable) {
            slots.push(timeString);
          }
        }
      }
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [formData.appointment_date, formData.service_id, services]);

  // Load available slots when date and service are selected
  useEffect(() => {
    if (formData.appointment_date && formData.service_id) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.appointment_date, formData.service_id, loadAvailableSlots]);

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

  const checkSlotAvailability = async (date: string, startTime: string, durationMinutes: number): Promise<boolean> => {
    try {
      const result = await appointmentsApi.checkAvailability(date, startTime, durationMinutes);
      return result === true;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // Calculate end time based on service duration
      const selectedService = services.find(s => s.id === formData.service_id);
      const durationMinutes = selectedService?.duration_minutes || 30;
      
      // Calculate end time (simple calculation - in production you'd want more sophisticated logic)
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      await appointmentsApi.create({
        customer_id: formData.customer_id,
        service_id: formData.service_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: endTimeString,
        status: 'scheduled',
        notes: formData.notes || null,
        total_price: selectedService?.price || 0,
        deposit_amount: 0,
        deposit_paid: formData.deposit_paid,
        reminder_sent: false
      });

      onAppointmentAdded();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erreur lors de la création du rendez-vous');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter un Rendez-vous</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
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
                Service *
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price} CAD ({service.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <DatePicker
                value={formData.appointment_date}
                onChange={(date) => setFormData({ ...formData, appointment_date: date, start_time: '' })}
                minDate={new Date().toISOString().split('T')[0]}
                placeholder="Sélectionner une date"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début *
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
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="deposit_paid"
              checked={formData.deposit_paid}
              onChange={(e) => setFormData({ ...formData, deposit_paid: e.target.checked })}
              className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
            />
            <label htmlFor="deposit_paid" className="text-sm font-medium text-gray-700">
              Acompte payé
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              placeholder="Ajouter des notes sur ce rendez-vous..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              className="px-4 py-2 bg-primary-pink text-white rounded-md hover:bg-dark-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le Rendez-vous
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 