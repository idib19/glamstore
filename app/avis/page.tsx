'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import AddReviewModal from '../../components/AddReviewModal';
import { Star, Quote, Heart, Crown, Sparkles, MessageCircle } from 'lucide-react';
import { reviewsApi } from '../../lib/supabase';
import { Database } from '../../types/database';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  products?: {
    id: string;
    name: string;
  } | null;
  services?: {
    id: string;
    name: string;
  } | null;
};

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await reviewsApi.getAll();
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Erreur lors du chargement des avis');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSubmitted = () => {
    // Refresh reviews after a new one is submitted
    const fetchReviews = async () => {
      try {
        const reviewsData = await reviewsApi.getAll();
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error refreshing reviews:', err);
      }
    };
    fetchReviews();
  };

  // Use real reviews from database
  const testimonials = reviews.map((review) => ({
    id: review.id,
    name: review.customer_name || `${review.customers?.first_name || ''} ${review.customers?.last_name || ''}`.trim() || 'Anonyme',
    service: review.services?.name || review.products?.name || 'Service',
    rating: review.rating,
    date: new Date(review.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    comment: review.comment,
    image: '/api/placeholder/100/100'
  }));

  const stats = [
    { 
      number: testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0', 
      label: 'Note moyenne', 
      icon: <Star className="h-8 w-8 text-primary-pink" /> 
    },
    { 
      number: testimonials.length > 0 ? '100%' : '0%', 
      label: 'Satisfaction', 
      icon: <Heart className="h-8 w-8 text-primary-pink" /> 
    },
    { 
      number: testimonials.length > 0 ? '✨' : '0', 
      label: 'Reines satisfaites', 
      icon: <Crown className="h-8 w-8 text-primary-pink" /> 
    },
    { 
      number: testimonials.length > 0 ? 'Queen\'s' : '0', 
      label: 'Glam Family', 
      icon: <Sparkles className="h-8 w-8 text-primary-pink" /> 
    }
  ];

  const services = [
    'Pose de perruque',
    'Manucure & pédicure',
    'Lip Gloss',
    'Masques à Lèvres',
    'Perruques Naturelles',
    'Coiffure de perruque',
    'Soins de perruque'
  ];

  const averageRating = testimonials.length > 0 ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length : 0;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ✨ Elles ont testé{' '}
              <span className="text-primary-pink">Queen&apos;s Glam</span>
              … et elles ont adoré !
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Chez Queen&apos;s Glam, la satisfaction de nos clientes est notre plus belle récompense.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Voici ce qu&apos;elles disent de leur expérience :
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-pink mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overall Rating Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              ✨ Note Globale Queen&apos;s Glam
            </h2>
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-4xl font-bold text-primary-pink mb-2">
              {averageRating.toFixed(1)}/5
            </div>
            <p className="text-gray-600">
              Basé sur {testimonials.length} avis de reines satisfaites
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Témoignages de nos Reines
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvre les expériences authentiques de nos clientes satisfaites.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des avis...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Erreur lors du chargement des avis</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gradient-to-br from-soft-pink to-light-pink rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="bg-white rounded-xl p-6 h-full">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <div className="mb-4">
                      <Quote className="h-6 w-6 text-primary-pink mb-2" />
                      <p className="text-gray-700 italic leading-relaxed">
                        &quot;{testimonial.comment}&quot;
                      </p>
                    </div>
                    
                    {/* Client Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-primary-pink">
                          {testimonial.service}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-soft-pink to-light-pink rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-8">
                  <div className="mb-6">
                    <div className="bg-soft-pink rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-10 w-10 text-primary-pink" />
                    </div>
                    <h3 className="font-elegant text-2xl font-bold text-gray-900 mb-4">
                      ✨ Sois la Première !
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Aucun avis pour le moment. Sois la première reine à partager ton expérience Queen&apos;s Glam et inspire d&apos;autres femmes à découvrir notre univers de beauté !
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>Partage ton expérience</span>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Laisser le Premier Avis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Mentioned Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Services Appréciés
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos reines adorent ces services Queen&apos;s Glam
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all">
                <div className="bg-soft-pink rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-6 w-6 text-primary-pink" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave Review CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="flex justify-center mb-6">
              <MessageCircle className="h-16 w-16 text-primary-pink" />
            </div>
            
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              ✨ Tu fais déjà partie de la Queen&apos;s Glam Family ?
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Laisse ton avis et aide d&apos;autres reines à découvrir l&apos;expérience !
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-pink text-white px-8 py-4 rounded-lg font-semibold hover:bg-dark-pink transition-all text-lg"
            >
              ✨ Laisser un avis
            </button>
          </div>
        </div>
      </section>

      {/* Why Reviews Matter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Pourquoi Tes Avis Comptent
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chaque avis aide d&apos;autres reines à découvrir la magie Queen&apos;s Glam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Inspire d&apos;Autres Reines</h3>
              <p className="text-sm text-gray-600">Ton expérience peut aider d&apos;autres femmes à se sentir belles et confiantes</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Partage ta Magie</h3>
              <p className="text-sm text-gray-600">Raconte comment Queen&apos;s Glam t&apos;a transformée et fait briller</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rejoins la Famille</h3>
              <p className="text-sm text-gray-600">Fais partie de notre communauté de reines satisfaites</p>
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <Footer />
    </div>
  );
} 