'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Calendar, Clock, User, CheckCircle, ArrowRight, Crown, Sparkles, Heart, Scissors } from 'lucide-react';

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
      id: 'manucure-pedicure',
      name: 'Manucure et pédicure (pose d&apos;ongles)',
      icon: <Heart className="h-8 w-8 text-primary-pink" />,
      duration: '60 min',
      description: 'Pose d&apos;ongles et soins complets pour mains et pieds'
    },
    {
      id: 'pose-perruque',
      name: 'Pose de perruque',
      icon: <Crown className="h-8 w-8 text-primary-pink" />,
      duration: '90 min',
      description: 'Pose de perruques pour un rendu impeccable'
    },
    {
      id: 'coiffure-perruque',
      name: 'Coiffure de perruque',
      icon: <Scissors className="h-8 w-8 text-primary-pink" />,
      duration: '45 min',
      description: 'Coiffure de perruques selon votre style'
    },
    {
      id: 'soins-perruque',
      name: 'Soins de perruque (remise à neuf)',
      icon: <Sparkles className="h-8 w-8 text-primary-pink" />,
      duration: '75 min',
      description: 'Remise à neuf pour redonner vie à votre favorite'
    }
  ];

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
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
              Réserve ton{' '}
              <span className="text-primary-pink">Moment Glam</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ✨ Prête pour un moment rien que pour toi ? Réserve ton rendez-vous en ligne !
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Chez Queen&apos;s Glam, chaque rendez-vous est une expérience sur mesure, pensée pour te sublimer.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-primary-pink opacity-20">
          <Crown className="h-12 w-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-primary-pink opacity-20">
          <Sparkles className="h-12 w-12" />
        </div>
      </section>

      {isSubmitted ? (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-soft-pink to-light-pink rounded-lg p-8 text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-pink" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✨ Rendez-vous Confirmé !
              </h2>
              <p className="text-gray-700 mb-6">
                ✅ Confirmation instantanée par e-mail ou SMS après réservation.
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h3>
                <div className="text-left space-y-2 text-sm">
                  <p><strong>Service :</strong> {selectedServiceData?.name}</p>
                  <p><strong>Date :</strong> {selectedDate}</p>
                  <p><strong>Heure :</strong> {selectedTime}</p>
                  <p><strong>Durée :</strong> {selectedServiceData?.duration}</p>
                  <p><strong>Lieu :</strong> Gatineau (adresse précisée après confirmation)</p>
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
              <div className="bg-pale-pink rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Crown className="h-6 w-6 mr-2 text-primary-pink" />
                  ✨ Tu peux réserver directement pour :
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                        selectedService === service.id
                          ? 'border-primary-pink bg-white shadow-md'
                          : 'border-gray-200 bg-white hover:border-primary-pink/50'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-soft-pink rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          {service.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center text-sm text-primary-pink font-medium">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-primary-pink" />
                  ✨ Choisis ta date, ton heure, ton service… et laisse la magie opérer.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Heure *
                    </label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
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
              <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary-pink" />
                  Tes Coordonnées
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                      placeholder="Ton nom complet"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                      placeholder="ton@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                      placeholder="Ton numéro de téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes spéciales (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all resize-none"
                    placeholder="Précisions sur tes préférences, demandes spéciales..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Réservation en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Réserver maintenant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
                ✨ Ton moment beauté commence ici
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Rendez-vous à Gatineau (adresse précisée après confirmation).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary-pink" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Confirmation Instantanée</h3>
                <p className="text-sm text-gray-600">Email ou SMS après réservation</p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-primary-pink" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expérience Sur Mesure</h3>
                <p className="text-sm text-gray-600">Chaque rendez-vous est personnalisé</p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary-pink" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Magie Queen&apos;s Glam</h3>
                <p className="text-sm text-gray-600">Laisse la magie opérer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 