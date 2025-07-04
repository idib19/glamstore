import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Clock, Star, Calendar, Sparkles, Heart, Users } from 'lucide-react';

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: 'soins-visage',
      title: 'Soins du Visage',
      icon: Heart,
      services: [
        {
          name: 'Soin Hydratant',
          description: 'Hydratation profonde pour tous types de peau',
          duration: '45 min',
          price: 45,
          popular: false
        },
        {
          name: 'Soin Anti-âge',
          description: 'Soin complet pour préserver la jeunesse de votre peau',
          duration: '60 min',
          price: 65,
          popular: true
        },
        {
          name: 'Soin Purifiant',
          description: 'Nettoyage en profondeur pour peaux mixtes à grasses',
          duration: '50 min',
          price: 55,
          popular: false
        },
        {
          name: 'Soin Détente',
          description: 'Moment de relaxation avec soin personnalisé',
          duration: '75 min',
          price: 75,
          popular: false
        }
      ]
    },
    {
      id: 'maquillage',
      title: 'Maquillage',
      icon: Sparkles,
      services: [
        {
          name: 'Maquillage Jour',
          description: 'Maquillage naturel et lumineux pour la journée',
          duration: '30 min',
          price: 35,
          popular: false
        },
        {
          name: 'Maquillage Soirée',
          description: 'Maquillage sophistiqué pour vos événements',
          duration: '45 min',
          price: 50,
          popular: true
        },
        {
          name: 'Maquillage Mariée',
          description: 'Maquillage de rêve pour votre jour J',
          duration: '90 min',
          price: 120,
          popular: false
        },
        {
          name: 'Cours de Maquillage',
          description: 'Apprenez les techniques de maquillage personnalisées',
          duration: '60 min',
          price: 80,
          popular: false
        }
      ]
    },
    {
      id: 'manucure',
      title: 'Manucure & Pedicure',
      icon: Users,
      services: [
        {
          name: 'Manucure Classique',
          description: 'Soin complet des mains avec vernis',
          duration: '30 min',
          price: 25,
          popular: false
        },
        {
          name: 'Manucure avec Gel',
          description: 'Manucure longue durée avec gel coloré',
          duration: '45 min',
          price: 35,
          popular: true
        },
        {
          name: 'Pedicure Relaxante',
          description: 'Soin complet des pieds avec massage',
          duration: '45 min',
          price: 40,
          popular: false
        },
        {
          name: 'Soin Complet Mains & Pieds',
          description: 'Package complet pour un soin total',
          duration: '75 min',
          price: 60,
          popular: false
        }
      ]
    },
    {
      id: 'massages',
      title: 'Massages & Détente',
      icon: Heart,
      services: [
        {
          name: 'Massage Relaxant',
          description: 'Massage doux pour détendre vos muscles',
          duration: '45 min',
          price: 55,
          popular: false
        },
        {
          name: 'Massage Décontractant',
          description: 'Massage en profondeur pour soulager les tensions',
          duration: '60 min',
          price: 70,
          popular: true
        },
        {
          name: 'Massage du Visage',
          description: 'Massage facial pour détendre et tonifier',
          duration: '30 min',
          price: 40,
          popular: false
        },
        {
          name: 'Massage Complet',
          description: 'Massage corps complet pour une détente totale',
          duration: '90 min',
          price: 95,
          popular: false
        }
      ]
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Qualité Premium',
      description: 'Produits haut de gamme et techniques professionnelles'
    },
    {
      icon: Clock,
      title: 'Flexibilité',
      description: 'Créneaux disponibles du lundi au samedi'
    },
    {
      icon: Users,
      title: 'Personnalisation',
      description: 'Soins adaptés à vos besoins spécifiques'
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
              Nos{' '}
              <span className="text-primary-pink">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète de services de beauté et bien-être. 
              Chaque soin est personnalisé pour répondre à vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-pink" />
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
          {serviceCategories.map((category, categoryIndex) => (
            <div key={category.id} id={category.id} className="mb-16 last:mb-0">
              <div className="text-center mb-12">
                <div className="bg-primary-pink rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <category.icon className="h-10 w-10 text-white" />
                </div>
                <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
                  {category.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Découvrez nos services spécialisés dans cette catégorie
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.services.map((service, serviceIndex) => (
                  <div 
                    key={serviceIndex} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                      service.popular ? 'ring-2 ring-primary-pink' : ''
                    }`}
                  >
                    {service.popular && (
                      <div className="bg-primary-pink text-white text-center py-2 text-sm font-medium">
                        Populaire
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                        <div className="text-primary-pink font-bold text-lg">
                          {service.price}€
                        </div>
                      </div>
                      <Link
                        href={`/rendez-vous?service=${encodeURIComponent(service.name)}`}
                        className="btn-primary w-full text-center text-sm"
                      >
                        <Calendar className="h-4 w-4 mr-2 inline" />
                        Réserver
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Nos Forfaits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profitez de nos forfaits avantageux pour optimiser votre routine beauté
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pale-pink rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Forfait Découverte
              </h3>
              <div className="text-4xl font-bold text-primary-pink mb-6">
                120€
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Soin du visage + Manucure
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Maquillage jour
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Consultation personnalisée
                </li>
              </ul>
              <Link href="/rendez-vous?package=decouverte" className="btn-primary w-full">
                Choisir ce forfait
              </Link>
            </div>
            
            <div className="bg-primary-pink rounded-lg p-8 text-center text-white">
              <div className="bg-white text-primary-pink px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Le Plus Populaire
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Forfait Bien-être
              </h3>
              <div className="text-4xl font-bold mb-6">
                180€
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-white mr-2" />
                  Soin anti-âge + Massage
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-white mr-2" />
                  Manucure avec gel
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-white mr-2" />
                  Maquillage soirée
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-white mr-2" />
                  Produits offerts
                </li>
              </ul>
              <Link href="/rendez-vous?package=bien-etre" className="bg-white text-primary-pink px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all w-full block">
                Choisir ce forfait
              </Link>
            </div>
            
            <div className="bg-pale-pink rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Forfait Premium
              </h3>
              <div className="text-4xl font-bold text-primary-pink mb-6">
                280€
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Soin complet + Massage
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Maquillage mariée
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Cours de maquillage
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-primary-pink mr-2" />
                  Kit produits complet
                </li>
              </ul>
              <Link href="/rendez-vous?package=premium" className="btn-primary w-full">
                Choisir ce forfait
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt(e) à Prendre Soin de Vous ?
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