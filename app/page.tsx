import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, Star, Heart, Sparkles, Crown, Palette, Scissors } from 'lucide-react';

export default function Home() {
  const essentialProducts = [
    {
      id: 1,
      title: 'Lip Gloss Ultra-hydratants',
      description: 'Lip gloss brillants et ultra-hydratants signés Queen&apos;s Glam',
      image: '/api/placeholder/300/200',
      href: '/produits#lip-gloss'
    },
    {
      id: 2,
      title: 'Masques à Lèvres',
      description: 'Masques adoucissants et régénérants pour des lèvres parfaites',
      image: '/api/placeholder/300/200',
      href: '/produits#masques-levres'
    },
    {
      id: 3,
      title: 'Perruques Naturelles',
      description: 'Perruques haut de gamme, confortables et stylées',
      image: '/api/placeholder/300/200',
      href: '/produits#perruques'
    }
  ];

  const personalizedServices = [
    {
      id: 1,
      title: 'Manucure & Pédicure',
      description: 'Pose d&apos;ongles et soins complets pour mains et pieds',
      icon: <Heart className="h-8 w-8 text-primary-pink" />,
      href: '/services#manucure'
    },
    {
      id: 2,
      title: 'Pose de Perruques',
      description: 'Pose de perruques pour un rendu impeccable',
      icon: <Crown className="h-8 w-8 text-primary-pink" />,
      href: '/services#pose-perruques'
    },
    {
      id: 3,
      title: 'Coiffure de Perruques',
      description: 'Coiffure de perruques selon votre style',
      icon: <Scissors className="h-8 w-8 text-primary-pink" />,
      href: '/services#coiffure-perruques'
    },
    {
      id: 4,
      title: 'Soins de Perruques',
      description: 'Remise à neuf pour redonner vie à votre favorite',
      icon: <Sparkles className="h-8 w-8 text-primary-pink" />,
      href: '/services#soins-perruques'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Marie L.',
      rating: 5,
      comment: 'Queen&apos;s Glam m&apos;a transformée ! Je me sens belle et confiante.',
      service: 'Pose de perruque'
    },
    {
      id: 2,
      name: 'Sophie D.',
      rating: 5,
      comment: 'Un univers glamour où je me sens comme une reine. Service exceptionnel !',
      service: 'Manucure & pédicure'
    },
    {
      id: 3,
      name: 'Claire M.',
      rating: 5,
      comment: 'Les lip gloss Queen&apos;s Glam sont magiques ! Je ne peux plus m&apos;en passer.',
      service: 'Produits cosmétiques'
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
              Bienvenue chez{' '}
              <span className="text-primary-pink">Queen&apos;s Glam</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
              Là où glamour, confiance et soin de soi se rencontrent.
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Queen&apos;s Glam, c&apos;est bien plus qu&apos;une boutique : c&apos;est un univers pensé
              pour sublimer ta beauté naturelle, révéler ton éclat et t&apos;offrir une
              expérience 100 % glamour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produits" className="btn-primary text-lg px-8 py-4">
                Découvrir nos Essentiels
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/services" className="btn-secondary text-lg px-8 py-4">
                Nos Services Personnalisés
              </Link>
            </div>
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

      {/* Essential Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Découvre nos essentiels signés Queen&apos;s Glam
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des produits de qualité pour révéler ta beauté naturelle et ton éclat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {essentialProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100">
                <div className="h-48 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                  <Palette className="h-16 w-16 text-primary-pink" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <Link
                    href={product.href}
                    className="text-primary-pink hover:text-dark-pink font-medium transition-all inline-flex items-center"
                  >
                    Découvrir →
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalizedServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {service.description}
                </p>
                <div className="text-center">
                  <Link
                    href={service.href}
                    className="text-primary-pink hover:text-dark-pink font-medium text-sm transition-all"
                  >
                    En savoir plus →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary text-lg px-8 py-4">
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
            Prêt(e) à Règner sur Ton Royaume de Beauté ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoins l&apos;univers Queen&apos;s Glam et offre-toi un moment rien que pour toi.
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
