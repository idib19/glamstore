'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Palette, Settings } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { categoriesApi, reviewsApi } from '../lib/supabase';
import { Database } from '../types/database';

type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];
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

export default function Home() {
  const [essentialProducts, setEssentialProducts] = useState<ProductCategory[]>([]);
  const [personalizedServices, setPersonalizedServices] = useState<ServiceCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoriesApi.getAll();
        // Get first 3 categories as "essential products"
        setEssentialProducts(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchServiceCategories = async () => {
      try {
        setServicesLoading(true);
        const data = await categoriesApi.getServiceCategories();
        // Get first 4 service categories as "personalized services"
        setPersonalizedServices(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching service categories:', error);
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await reviewsApi.getAll();
        // Get first 3 reviews for the homepage
        setReviews(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchCategories();
    fetchServiceCategories();
    fetchReviews();
  }, []);

  const getServiceIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('soin')) return <Settings className="h-8 w-8 text-primary-pink" />;
    if (name.includes('massage')) return <Settings className="h-8 w-8 text-primary-pink" />;
    if (name.includes('maquillage')) return <Settings className="h-8 w-8 text-primary-pink" />;
    if (name.includes('coiffure')) return <Settings className="h-8 w-8 text-primary-pink" />;
    return <Settings className="h-8 w-8 text-primary-pink" />;
  };

  // Convert reviews to testimonials format
  const testimonials = reviews.map((review) => ({
    id: review.id,
    name: review.customer_name || `${review.customers?.first_name || ''} ${review.customers?.last_name || ''}`.trim() || 'Anonyme',
    rating: review.rating,
    comment: review.comment,
    service: review.services?.name || review.products?.name || 'Service'
  }));

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20 overflow-hidden">
        {/* Remove Background Image */}
        {/* Overlay for better text readability */}
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
              Bienvenue dans ton
              <span className="text-primary-pink block drop-shadow-lg">Royaume de Beauté</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Découvre l&apos;univers Queen&apos;s Glam où chaque détail est pensé pour que tu te sentes belle, 
              confiante et rayonnante — à l&apos;intérieur comme à l&apos;extérieur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rendez-vous" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center bg-primary-pink hover:bg-dark-pink text-white shadow-lg">
                Prendre Rendez-vous
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/services" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 shadow-lg">
                Découvrir nos Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Nos Produits Essentiels
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvre notre sélection de produits de beauté et de soins pour prendre soin de toi au quotidien.
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : essentialProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {essentialProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100">
                  <div className="h-48 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name}
                        width={400}
                        height={192}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Palette className="h-16 w-16 text-primary-pink" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description || 'Découvrez nos produits exceptionnels signés Queen\'s Glam'}
                    </p>
                    <Link
                      href={`/produits#${product.slug}`}
                      className="text-primary-pink hover:text-dark-pink font-medium transition-all inline-flex items-center"
                    >
                      Découvrir →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune catégorie de produits disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Personalized Services Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Offre-toi un moment rien que pour toi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grâce à nos services personnalisés pour te sentir belle, confiante et rayonnante.
            </p>
          </div>
          
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : personalizedServices.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {personalizedServices.map((service) => (
                 <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                   {/* Service Image */}
                   <div className="h-32 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                     {service.image_url ? (
                       <Image 
                         src={service.image_url} 
                         alt={service.name}
                         width={400}
                         height={128}
                         className="h-full w-full object-cover"
                       />
                     ) : (
                       <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center">
                         {getServiceIcon(service.name)}
                       </div>
                     )}
                   </div>
                   
                   {/* Service Content */}
                   <div className="p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                       {service.name}
                     </h3>
                     <p className="text-gray-600 text-sm text-center mb-4">
                       {service.description || 'Service personnalisé pour vous sentir belle et confiante'}
                     </p>
                     <div className="text-center">
                       <Link
                         href={`/services#${service.slug}`}
                         className="text-primary-pink hover:text-dark-pink font-medium text-sm transition-all"
                       >
                         En savoir plus →
                       </Link>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
                     ) : (
             <div className="text-center py-12">
               <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
               <p className="text-gray-500">Aucun service personnalisé disponible pour le moment.</p>
             </div>
           )}
           
           <div className="text-center mt-12">
             <Link href="/services" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
               Découvrir Tous nos Services
               <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-soft-pink to-light-pink rounded-2xl p-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              Notre Philosophie
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Chaque détail est pensé pour que tu te sentes belle, confiante et
              rayonnante — à l&apos;intérieur comme à l&apos;extérieur.
            </p>
            <div className="text-4xl mb-6">✨</div>
            <h3 className="font-elegant text-2xl font-bold text-primary-pink mb-4">
              Bienvenue dans ton royaume.
            </h3>
            <p className="text-xl font-semibold text-gray-900">
              Bienvenue chez Queen&apos;s Glam.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Avis de nos Reines
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos clientes disent de leur expérience chez Queen&apos;s Glam.
            </p>
          </div>
          
          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="animate-pulse">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-5 w-5 bg-gray-200 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.comment}&quot;
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-primary-pink">
                      {testimonial.service}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-md">
                <div className="mb-6">
                  <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary-pink" />
                  </div>
                  <h3 className="font-elegant text-xl font-bold text-gray-900 mb-2">
                    ✨ Sois la Première !
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Aucun avis pour le moment. Partage ton expérience Queen&apos;s Glam !
                  </p>
                </div>
                <Link href="/avis" className="btn-primary text-sm px-6 py-3 inline-flex items-center justify-center">
                  <Star className="h-4 w-4 mr-2" />
                  Laisser un Avis
                </Link>
              </div>
            </div>
          )}
          
          {testimonials.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/avis" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                Voir Tous les Avis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt(e) à Règner sur Ton Royaume de Beauté ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoins l&apos;univers Queen&apos;s Glam et offre-toi un moment rien que pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rendez-vous" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center">
              Prendre Rendez-vous
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all inline-flex items-center justify-center">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
