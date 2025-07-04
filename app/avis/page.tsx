import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Star, Quote, Heart, Users, Calendar } from 'lucide-react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: 'Marie L.',
      service: 'Soins du visage',
      rating: 5,
      date: '15 décembre 2024',
      comment: 'Service exceptionnel ! Je me sens magnifique après chaque séance. L\'équipe est professionnelle et bienveillante. Je recommande vivement !',
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Sophie D.',
      service: 'Maquillage',
      rating: 5,
      date: '12 décembre 2024',
      comment: 'Équipe professionnelle et accueillante. Mon maquillage de mariée était parfait, exactement ce que je souhaitais. Je recommande vivement !',
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Claire M.',
      service: 'Massage',
      rating: 5,
      date: '10 décembre 2024',
      comment: 'Un moment de détente parfait. Le massage était relaxant et professionnel. Je reviendrai sans hésiter pour me ressourcer.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'Julie R.',
      service: 'Manucure',
      rating: 5,
      date: '8 décembre 2024',
      comment: 'Soin des mains impeccable ! Le gel tient parfaitement et le résultat est magnifique. L\'ambiance est très agréable.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 5,
      name: 'Anne S.',
      service: 'Soins du visage',
      rating: 5,
      date: '5 décembre 2024',
      comment: 'Première visite et je suis conquise ! Soin personnalisé, produits de qualité et résultat visible immédiatement. Je reviendrai !',
      image: '/api/placeholder/100/100'
    },
    {
      id: 6,
      name: 'Isabelle T.',
      service: 'Maquillage',
      rating: 5,
      date: '3 décembre 2024',
      comment: 'Maquillage pour une soirée d\'entreprise parfait ! Naturel et élégant, j\'ai reçu beaucoup de compliments. Merci !',
      image: '/api/placeholder/100/100'
    },
    {
      id: 7,
      name: 'Nathalie B.',
      service: 'Massage',
      rating: 5,
      date: '1 décembre 2024',
      comment: 'Massage décontractant excellent ! J\'avais des tensions dans le dos et je me sens beaucoup mieux. Personnel très compétent.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 8,
      name: 'Caroline F.',
      service: 'Pedicure',
      rating: 5,
      date: '28 novembre 2024',
      comment: 'Pedicure relaxante parfaite ! Soin complet avec massage, je me sens comme une princesse. Ambiance zen et professionnelle.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 9,
      name: 'Laurence P.',
      service: 'Soins du visage',
      rating: 5,
      date: '25 novembre 2024',
      comment: 'Soin anti-âge remarquable ! Ma peau est plus lumineuse et hydratée. Les conseils prodigués sont précieux. Très satisfaite !',
      image: '/api/placeholder/100/100'
    },
    {
      id: 10,
      name: 'Valérie M.',
      service: 'Maquillage',
      rating: 5,
      date: '22 novembre 2024',
      comment: 'Cours de maquillage très instructif ! J\'ai appris des techniques que je peux reproduire chez moi. Format parfait.',
      image: '/api/placeholder/100/100'
    }
  ];

  const stats = [
    { number: '4.9', label: 'Note moyenne', icon: Star },
    { number: '500+', label: 'Avis clients', icon: Users },
    { number: '98%', label: 'Satisfaction', icon: Heart },
    { number: '5', label: 'Années d\'expérience', icon: Calendar }
  ];

  const services = [
    'Soins du visage',
    'Maquillage',
    'Massage',
    'Manucure',
    'Pedicure'
  ];

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Avis de nos{' '}
              <span className="text-primary-pink">Client(e)s</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que nos client(e)s disent de leur expérience chez GlamStore. 
              Votre satisfaction est notre priorité.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary-pink" />
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              Note Globale
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
              Basé sur {testimonials.length} avis clients
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Témoignages Clients
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les expériences authentiques de nos client(e)s satisfait(e)s.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-pale-pink rounded-lg p-6 hover:shadow-lg transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-soft-pink to-light-pink rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-pink" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-primary-pink">
                        {testimonial.service}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
                
                {/* Quote */}
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-primary-pink mb-2" />
                  <p className="text-gray-700 italic">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Reviews Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Avis par Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les notes moyennes pour chaque service que nous proposons.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const serviceTestimonials = testimonials.filter(t => t.service === service);
              const serviceRating = serviceTestimonials.length > 0 
                ? serviceTestimonials.reduce((sum, t) => sum + t.rating, 0) / serviceTestimonials.length 
                : 0;
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {service}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(serviceRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-primary-pink">
                      {serviceRating.toFixed(1)}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {serviceTestimonials.length} avis
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leave Review CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-pink to-rose-pink rounded-lg p-8 text-white">
            <h2 className="font-elegant text-3xl font-bold mb-4">
              Partagez Votre Expérience
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Votre avis est important pour nous et aide d'autres personnes à nous découvrir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                Laisser un Avis
              </a>
              <a href="/services" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
                Découvrir nos Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Nos Client(e)s Nous Fait Confiance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre engagement envers l'excellence et la satisfaction client.
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
                <Star className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qualité Premium
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez nos Client(e)s Satisfait(e)s
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Venez découvrir pourquoi nos client(e)s nous font confiance pour leur beauté et bien-être.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/rendez-vous" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Prendre Rendez-vous
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