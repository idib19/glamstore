import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, Star, Heart, Sparkles, Users } from 'lucide-react';

export default function Home() {
  const featuredServices = [
    {
      id: 1,
      title: 'Soins du Visage',
      description: 'Découvrez nos soins personnalisés pour révéler votre beauté naturelle',
      price: 'À partir de 45€',
      image: '/api/placeholder/300/200',
      href: '/services#soins-visage'
    },
    {
      id: 2,
      title: 'Maquillage Professionnel',
      description: 'Maquillage pour tous vos événements spéciaux',
      price: 'À partir de 35€',
      image: '/api/placeholder/300/200',
      href: '/services#maquillage'
    },
    {
      id: 3,
      title: 'Manucure & Pedicure',
      description: 'Soins complets pour vos mains et pieds',
      price: 'À partir de 25€',
      image: '/api/placeholder/300/200',
      href: '/services#manucure'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Marie L.',
      rating: 5,
      comment: 'Service exceptionnel ! Je me sens magnifique après chaque séance.',
      service: 'Soins du visage'
    },
    {
      id: 2,
      name: 'Sophie D.',
      rating: 5,
      comment: 'Équipe professionnelle et accueillante. Je recommande vivement !',
      service: 'Maquillage'
    },
    {
      id: 3,
      name: 'Claire M.',
      rating: 5,
      comment: 'Un moment de détente parfait. Je reviendrai sans hésiter.',
      service: 'Massage'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre Beauté,{' '}
              <span className="text-primary-pink">Notre Passion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez nos services de beauté et bien-être personnalisés. 
              Prenez soin de vous dans un cadre chaleureux et professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rendez-vous" className="btn-primary text-lg px-8 py-4">
                Prendre Rendez-vous
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/services" className="btn-secondary text-lg px-8 py-4">
                Découvrir nos Services
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-primary-pink opacity-20">
          <Sparkles className="h-12 w-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-primary-pink opacity-20">
          <Heart className="h-12 w-12" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir GlamStore ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à vous offrir une expérience beauté exceptionnelle 
              avec des produits de qualité et un service personnalisé.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Soins Personnalisés
              </h3>
              <p className="text-gray-600">
                Chaque traitement est adapté à vos besoins spécifiques et à votre type de peau.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Produits de Qualité
              </h3>
              <p className="text-gray-600">
                Nous utilisons exclusivement des produits haut de gamme et respectueux de votre peau.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Équipe Experte
              </h3>
              <p className="text-gray-600">
                Notre équipe de professionnels qualifiés vous accompagne avec bienveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Nos Services Vedettes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos services les plus populaires et réservez votre créneau dès maintenant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-primary-pink" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-pink font-semibold">
                      {service.price}
                    </span>
                    <Link
                      href={service.href}
                      className="text-primary-pink hover:text-dark-pink font-medium transition-all"
                    >
                      En savoir plus →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary text-lg px-8 py-4">
              Voir Tous nos Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Avis de nos Client(e)s
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos client(e)s disent de leur expérience chez GlamStore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-pale-pink rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.comment}"
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
          
          <div className="text-center mt-12">
            <Link href="/avis" className="btn-secondary text-lg px-8 py-4">
              Voir Tous les Avis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt(e) à Révéler Votre Beauté ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Réservez votre créneau dès maintenant et offrez-vous un moment de détente et de beauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rendez-vous" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Prendre Rendez-vous
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
