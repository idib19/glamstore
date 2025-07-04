'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function AppointmentPage() {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    {
      id: 'soin-hydratant',
      name: 'Soin Hydratant',
      duration: '45 min',
      price: 45,
      category: 'Soins du visage'
    },
    {
      id: 'soin-anti-age',
      name: 'Soin Anti-âge',
      duration: '60 min',
      price: 65,
      category: 'Soins du visage'
    },
    {
      id: 'maquillage-jour',
      name: 'Maquillage Jour',
      duration: '30 min',
      price: 35,
      category: 'Maquillage'
    },
    {
      id: 'maquillage-soiree',
      name: 'Maquillage Soirée',
      duration: '45 min',
      price: 50,
      category: 'Maquillage'
    },
    {
      id: 'manucure-classique',
      name: 'Manucure Classique',
      duration: '30 min',
      price: 25,
      category: 'Manucure'
    },
    {
      id: 'manucure-gel',
      name: 'Manucure avec Gel',
      duration: '45 min',
      price: 35,
      category: 'Manucure'
    },
    {
      id: 'massage-relaxant',
      name: 'Massage Relaxant',
      duration: '45 min',
      price: 55,
      category: 'Massage'
    },
    {
      id: 'massage-decontractant',
      name: 'Massage Décontractant',
      duration: '60 min',
      price: 70,
      category: 'Massage'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Veuillez sélectionner un service, une date et une heure.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
    }, 5000);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Prendre un{' '}
              <span className="text-primary-pink">Rendez-vous</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Réservez votre créneau en quelques clics et offrez-vous un moment de détente et de beauté.
            </p>
          </div>
        </div>
      </section>

      {isSubmitted ? (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Rendez-vous Confirmé !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre rendez-vous a été enregistré avec succès. Nous vous enverrons un email de confirmation 
                avec tous les détails de votre réservation.
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h3>
                <div className="text-left space-y-2 text-sm">
                  <p><strong>Service :</strong> {selectedServiceData?.name}</p>
                  <p><strong>Date :</strong> {selectedDate}</p>
                  <p><strong>Heure :</strong> {selectedTime}</p>
                  <p><strong>Durée :</strong> {selectedServiceData?.duration}</p>
                  <p><strong>Prix :</strong> {selectedServiceData?.price}€</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <div className="bg-pale-pink rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-primary-pink" />
                  Choisir un Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedService === service.id
                          ? 'border-primary-pink bg-white shadow-md'
                          : 'border-gray-200 bg-white hover:border-primary-pink/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-primary-pink font-bold">{service.price}€</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="bg-pale-pink rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary-pink" />
                  Choisir Date et Heure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure *
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="form-input"
                      required
                    >
                      <option value="">Choisir une heure</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-pale-pink rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary-pink" />
                  Informations Personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes ou demandes spéciales
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Informations supplémentaires, allergies, préférences..."
                  />
                </div>
              </div>

              {/* Summary */}
              {selectedServiceData && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service :</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durée :</span>
                      <span className="font-medium">{selectedServiceData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix :</span>
                      <span className="font-bold text-primary-pink">{selectedServiceData.price}€</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime}
                  className={`btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto ${
                    isSubmitting || !selectedService || !selectedDate || !selectedTime
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      Confirmer le Rendez-vous
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Informations Importantes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quelques points à connaître avant votre rendez-vous.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Horaires
              </h3>
              <p className="text-gray-600">
                Nous sommes ouverts du lundi au samedi de 9h à 19h. 
                Merci d'arriver 10 minutes avant votre rendez-vous.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Annulation
              </h3>
              <p className="text-gray-600">
                Merci de nous prévenir au moins 24h à l'avance en cas d'annulation 
                ou de modification de votre rendez-vous.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Préparation
              </h3>
              <p className="text-gray-600">
                Pour certains soins, nous vous demanderons de venir sans maquillage. 
                Nous vous fournirons tous les détails par email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Questions sur nos Services ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous conseiller et répondre à toutes vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Nous Contacter
            </a>
            <a href="/services" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Découvrir nos Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 