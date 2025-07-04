import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Heart, Sparkles, Award, Users, Clock, MapPin } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Notre passion pour la beauté naturelle guide chaque soin que nous proposons.'
    },
    {
      icon: Sparkles,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque détail pour vous offrir une expérience unique.'
    },
    {
      icon: Users,
      title: 'Bienveillance',
      description: 'Votre bien-être est au cœur de notre approche personnalisée et bienveillante.'
    }
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Fondatrice & Esthéticienne',
      description: 'Passionnée de beauté depuis plus de 10 ans, Marie a créé GlamStore pour partager son expertise et sa vision de la beauté naturelle.',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Sophie Martin',
      role: 'Maquilleuse Professionnelle',
      description: 'Spécialisée dans le maquillage pour tous types d\'événements, Sophie vous accompagne pour révéler votre beauté.',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Claire Bernard',
      role: 'Manucure & Pedicure',
      description: 'Experte en soins des mains et pieds, Claire vous offre des soins complets et relaxants.',
      image: '/api/placeholder/200/200'
    }
  ];

  const stats = [
    { number: '500+', label: 'Clientes Satisfaites' },
    { number: '5', label: 'Années d\'Expérience' },
    { number: '50+', label: 'Services Proposés' },
    { number: '98%', label: 'Taux de Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              À Propos de{' '}
              <span className="text-primary-pink">GlamStore</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre histoire, notre passion et notre engagement 
              pour vous offrir les meilleurs soins de beauté.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  GlamStore est né d'une passion pour la beauté naturelle et d'un désir 
                  de créer un espace où chaque personne peut se sentir belle et confiante.
                </p>
                <p>
                  Fondée en 2019 par Marie Dubois, notre institut de beauté s'est développé 
                  avec une vision claire : offrir des soins personnalisés de qualité dans 
                  un environnement chaleureux et professionnel.
                </p>
                <p>
                  Aujourd'hui, notre équipe d'experts qualifiés s'engage à vous accompagner 
                  dans votre quête de beauté avec des produits haut de gamme et des 
                  techniques innovantes.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-soft-pink to-light-pink rounded-lg h-96 flex items-center justify-center">
              <Sparkles className="h-24 w-24 text-primary-pink" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ces valeurs guident chacune de nos actions et définissent notre approche 
              de la beauté et du bien-être.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary-pink" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-pink mb-2">
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

      {/* Team Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les professionnels passionnés qui composent notre équipe 
              et qui s'engagent à vous offrir une expérience exceptionnelle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary-pink" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-pink font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              Notre Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Chez GlamStore, notre mission est de vous accompagner dans votre quête de beauté 
                naturelle et authentique. Nous croyons que chaque personne mérite de se sentir 
                belle et confiante dans sa peau.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                À travers nos soins personnalisés, nos produits de qualité et notre approche 
                bienveillante, nous nous engageons à créer un espace où vous pouvez vous 
                détendre, vous ressourcer et révéler votre beauté intérieure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt(e) à Nous Rencontrer ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Venez découvrir notre univers et laissez-nous prendre soin de vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/rendez-vous" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Prendre Rendez-vous
            </a>
            <a href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 