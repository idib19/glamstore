import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Star, Calendar, Sparkles, Heart, Crown, Scissors, CheckCircle, MapPin, MessageCircle } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      id: 'manucure-pedicure',
      title: '💅 Manucure & Pédicure – Pose d\'ongles',
      subtitle: 'Des mains et des pieds impeccables pour toutes les occasions.',
      icon: <Heart className="h-8 w-8 text-primary-pink" />,
      services: [
        {
          name: 'Pose d\'ongles (gel ou capsules)',
          price: 'à partir de 45 CAD',
          description: 'Pose professionnelle avec gel ou capsules'
        },
        {
          name: 'Gel, Pédicure simple ou pose',
          price: 'à partir de 25 CAD',
          description: 'Soin complet des pieds avec pose'
        }
      ],
      note: '✨ Designs et options personnalisées disponibles sur demande.'
    },
    {
      id: 'pose-perruque',
      title: '👑 Pose de perruque',
      subtitle: 'Une pose propre, naturelle et durable.',
      icon: <Crown className="h-8 w-8 text-primary-pink" />,
      services: [
        {
          name: 'Pose perruque sans colle',
          price: '30 CAD',
          description: 'Pose sécurisée sans adhésif'
        },
        {
          name: 'Pose perruque avec colle (colle fournie)',
          price: '45 CAD',
          description: 'Pose durable avec adhésif professionnel'
        },
        {
          name: 'Pose frontale lace wig avec baby hair',
          price: '55 CAD',
          description: 'Pose sophistiquée avec finitions naturelles'
        }
      ]
    },
    {
      id: 'coiffure-perruque',
      title: '✂️ Coiffure de perruque',
      subtitle: 'Fais styliser ta perruque selon ton style !',
      icon: <Scissors className="h-8 w-8 text-primary-pink" />,
      services: [
        {
          name: 'Lissage ou bouclage simple',
          price: '30 CAD',
          description: 'Stylisation basique selon vos préférences'
        },
        {
          name: 'Coiffure personnalisée (avec coupe ou stylisation spécifique)',
          price: 'à partir de 40 CAD',
          description: 'Coiffure sur mesure avec coupe ou style spécial'
        }
      ]
    },
    {
      id: 'soins-perruque',
      title: '✨ Soins de perruque (Remise à neuf)',
      subtitle: 'Restaure l&apos;éclat de ta perruque préférée !',
      icon: <Sparkles className="h-8 w-8 text-primary-pink" />,
      services: [
        {
          name: 'Shampoing + revitalisant + séchage',
          price: '25 CAD',
          description: 'Nettoyage et soin de base'
        },
        {
          name: 'Remise à neuf complète (soin profond, coiffage)',
          price: 'à partir de 50 CAD',
          description: 'Soin complet avec traitement en profondeur'
        }
      ]
    }
  ];

  const benefits = [
    {
      icon: <Star className="h-8 w-8 text-primary-pink" />,
      title: 'Expérience Personnalisée',
      description: 'Chaque service est adapté à tes besoins spécifiques'
    },
    {
      icon: <Heart className="h-8 w-8 text-primary-pink" />,
      title: 'Ambiance Chaleureuse',
      description: 'Un environnement professionnel et 100% glam'
    },
    {
      icon: <Crown className="h-8 w-8 text-primary-pink" />,
      title: 'Qualité Premium',
      description: 'Produits et techniques professionnelles'
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
              ✨ Nos{' '}
              <span className="text-primary-pink">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              &quot;La beauté, à ton image&quot;
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Chez Queen&apos;s Glam, chaque service est conçu pour t&apos;offrir un moment de soin, de style et de confiance. 
              Profite d&apos;une expérience personnalisée dans une ambiance chaleureuse, professionnelle et 100 % glam.
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

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-soft-pink to-light-pink p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mr-6">
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h2>
                      <p className="text-gray-700 text-lg">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    {service.services.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <span className="text-xl font-bold text-primary-pink">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    ))}
                    
                    {service.note && (
                      <div className="bg-soft-pink rounded-lg p-4 mt-6">
                        <p className="text-gray-700 font-medium">
                          {service.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-soft-pink to-light-pink rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
                ✨ Informations Importantes
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-pink" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lieu</h3>
                  <p className="text-gray-700">Gatineau, QC</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary-pink" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Réservation</h3>
                  <p className="text-gray-700">Réservation obligatoire. Les rendez-vous sont confirmés par message ou courriel.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-primary-pink" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acompte</h3>
                  <p className="text-gray-700">Un acompte peut être requis pour certains services.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary-pink" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-700">N&apos;hésite pas à nous contacter pour toute question ou demande spéciale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            ✨ Prête pour ton Moment Glam ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Réserve ton rendez-vous et offre-toi un moment rien que pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rendez-vous" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Réserver Maintenant
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