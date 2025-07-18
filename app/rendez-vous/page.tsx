'use client';

import { useState, useEffect, useCallback } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { servicesApi, appointmentsApi, customersApi, timeSlotsApi } from '../../lib/supabase';
import { emailService } from '../../lib/emailService';
import { notificationService } from '../../lib/notificationService';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import DatePicker from '../../components/DatePicker';
import TimePicker from '../../components/TimePicker';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  service_categories?: {
    id: string;
    name: string;
  } | null;
}

export default function RendezVousPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Business hours (9 AM to 7 PM)
  const businessHours = {
    start: 9,
    end: 19,
    interval: 30 // 30-minute intervals
  };

  useEffect(() => {
    loadServices();
    loadAvailableDays();
  }, []);

  const loadAvailableSlots = useCallback(async () => {
    if (!selectedDate || !selectedService) return;

    try {
      setIsLoadingSlots(true);
      const slots: string[] = [];
      
      // Generate time slots for the selected date
      for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += businessHours.interval) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if this slot is available
          const isAvailable = await checkSlotAvailability(selectedDate, timeString, selectedService.duration_minutes);
          if (isAvailable) {
            slots.push(timeString);
          }
        }
      }
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setBookingError('Erreur lors du chargement des créneaux disponibles');
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedDate, selectedService, businessHours.start, businessHours.end, businessHours.interval]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedService, loadAvailableSlots]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      setBookingError('Erreur lors du chargement des services');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableDays = async () => {
    try {
      const data = await timeSlotsApi.getAvailableDays();
      setAvailableDays(data);
    } catch (error) {
      console.error('Error loading available days:', error);
      // If there's an error, allow all days (fallback)
      setAvailableDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
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

  const handleServiceSelection = (service: Service) => {
    setSelectedService(service);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
    setBookingStep(2);
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setBookingStep(3);
  };

  const handleCustomerFormChange = (field: string, value: string) => {
    setCustomerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCustomerForm = () => {
    if (!customerForm.first_name.trim()) return 'Le prénom est requis';
    if (!customerForm.last_name.trim()) return 'Le nom est requis';
    if (!customerForm.email.trim()) return 'L&apos;email est requis';
    if (!customerForm.phone.trim()) return 'Le téléphone est requis';
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerForm.email)) return 'Format d&apos;email invalide';
    
    return null;
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setBookingError('Veuillez sélectionner un service, une date et une heure');
      return;
    }

    const validationError = validateCustomerForm();
    if (validationError) {
      setBookingError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setBookingError('');

      // Check if customer already exists by email
      let customerId: string;
      const existingCustomer = await customersApi.getByEmail(customerForm.email);
      
      if (existingCustomer) {
        // Use existing customer
        customerId = existingCustomer.id;
        console.log('Using existing customer:', existingCustomer.id);
      } else {
        // Create new customer
        const newCustomer = await customersApi.create({
          first_name: customerForm.first_name,
          last_name: customerForm.last_name,
          email: customerForm.email,
          phone: customerForm.phone,
          is_active: true
        });
        customerId = newCustomer.id;
        console.log('Created new customer:', newCustomer.id);
      }

      // Calculate end time
      const startTime = new Date(`2000-01-01T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + selectedService.duration_minutes * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      // Create appointment
      const newAppointment = await appointmentsApi.create({
        customer_id: customerId,
        service_id: selectedService.id,
        appointment_date: selectedDate,
        start_time: selectedTime,
        end_time: endTimeString,
        status: 'scheduled',
        notes: null,
        total_price: selectedService.price
      });

      // Send confirmation email
      try {
        await emailService.sendAppointmentConfirmation({
          customerName: `${customerForm.first_name} ${customerForm.last_name}`,
          customerEmail: customerForm.email,
          serviceName: selectedService.name,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          duration: selectedService.duration_minutes,
          price: selectedService.price,
          appointmentId: newAppointment.id
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue with booking even if email fails
      }

      // Create notification
      try {
        await notificationService.createAppointmentConfirmationNotification({
          customer_id: customerId,
          customer_name: `${customerForm.first_name} ${customerForm.last_name}`,
          service_name: selectedService.name,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          appointment_id: newAppointment.id,
          price: selectedService.price
        });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Continue with booking even if notification fails
      }

      setBookingSuccess(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setBookingError('Erreur lors de la création du rendez-vous. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingError('');
    setCustomerForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Rendez-vous confirmé !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre rendez-vous a été réservé avec succès. Vous recevrez un email de confirmation.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Détails du rendez-vous :</h3>
              <p><strong>Service :</strong> {selectedService?.name}</p>
              <p><strong>Date :</strong> {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Heure :</strong> {selectedTime}</p>
              <p><strong>Durée :</strong> {selectedService?.duration_minutes} minutes</p>
              <p><strong>Prix :</strong> {selectedService?.price} CAD</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetBooking}
                className="btn-primary"
              >
                Prendre un autre rendez-vous
              </button>
              <a
                href="/dashboard"
                className="btn-secondary"
              >
                Retour au tableau de bord
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prendre un Rendez-vous
          </h1>
          <p className="text-gray-600">
            Réservez votre créneau pour nos services de beauté
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  bookingStep >= step 
                    ? 'bg-primary-pink text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    bookingStep > step ? 'bg-primary-pink' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {bookingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{bookingError}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Step 1: Service Selection */}
          {bookingStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Choisissez votre service
              </h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                  <span className="ml-2 text-gray-600">Chargement des services...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelection(service)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-pink hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-primary-pink font-semibold">{service.price} CAD</span>
                        <span className="text-sm text-gray-500">{service.duration_minutes} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {bookingStep === 2 && selectedService && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Choisissez votre créneau
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du rendez-vous
                  </label>
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateSelection}
                    minDate={getMinDate()}
                    maxDate={getMaxDate()}
                    availableDays={availableDays}
                    placeholder="Choisissez une date pour votre rendez-vous"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure du rendez-vous
                  </label>
                  {selectedDate ? (
                    <TimePicker
                      value={selectedTime}
                      onChange={handleTimeSelection}
                      availableSlots={availableSlots}
                      isLoading={isLoadingSlots}
                      placeholder="Choisissez une heure pour votre rendez-vous"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Veuillez d&apos;abord sélectionner une date
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Service Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Service sélectionné :</h3>
                <p className="text-gray-600">{selectedService.name} - {selectedService.price} CAD ({selectedService.duration_minutes} min)</p>
              </div>
            </div>
          )}

          {/* Step 3: Customer Information */}
          {bookingStep === 3 && selectedService && selectedDate && selectedTime && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Vos informations
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={customerForm.first_name}
                      onChange={(e) => handleCustomerFormChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={customerForm.last_name}
                      onChange={(e) => handleCustomerFormChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => handleCustomerFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => handleCustomerFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Récapitulatif :</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Service :</strong> {selectedService.name}
                  </div>
                  <div>
                    <strong>Date :</strong> {new Date(selectedDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <strong>Heure :</strong> {selectedTime}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <strong>Prix :</strong> {selectedService.price} CAD
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setBookingStep(2)}
                  className="btn-secondary"
                >
                  Retour
                </button>
                <button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Réservation...' : 'Confirmer le rendez-vous'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 