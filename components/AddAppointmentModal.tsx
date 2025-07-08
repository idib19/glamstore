'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { appointmentsApi, servicesApi, customersApi } from '../lib/supabase';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
}

export default function AddAppointmentModal({ isOpen, onClose, onAppointmentAdded }: AddAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
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
    }
  }, [isOpen]);

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
                    {service.name} - {service.price}€ ({service.duration_minutes} min)
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
              <input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              />
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