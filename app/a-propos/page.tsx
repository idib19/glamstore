import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { Heart, Sparkles, Crown, Star, Quote } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Star className="h-8 w-8 text-primary-pink" />,
      title: 'Pour la qualité',
      description: 'Des produits et services de qualité supérieure pour sublimer votre beauté.'
    },
    {
      icon: <Crown className="h-8 w-8 text-primary-pink" />,
      title: 'Pour l\'élégance',
      description: 'Un univers glamour où chaque détail est pensé pour révéler votre éclat.'
    },
    {
      icon: <Heart className="h-8 w-8 text-primary-pink" />,
      title: 'Pour l\'estime de soi',
      description: 'Accompagner chaque femme dans sa quête de confiance et de bien-être.'
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
              À Propos de{' '}
              <span className="text-primary-pink">Queen&apos;s Glam</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Queen&apos;s Glam, c&apos;est l&apos;expression d&apos;un rêve devenu réalité.
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

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              ✨ Notre Histoire
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Queen&apos;s Glam, c&apos;est l&apos;expression d&apos;un rêve devenu réalité. Celui d&apos;une femme passionnée par la beauté, le glamour et le bien-être, qui a voulu créer un espace où chaque femme peut se sentir belle, confiante et valorisée.
            </p>
            
            <p>
              Fondée par <strong>Anouchka Abegue Nguema ép Madouma</strong>, Queen&apos;s Glam est bien plus qu&apos;une marque : c&apos;est une célébration de la féminité sous toutes ses formes. À travers une gamme de produits soigneusement conçus — lip gloss, masques à lèvres et perruques naturelles de qualité supérieure — et des services personnalisés comme la pose d&apos;ongles, l&apos;installation, la coiffure et les soins de perruques, Queen&apos;s Glam accompagne chaque femme dans sa mise en beauté… à sa façon.
            </p>
            
            <div className="bg-gradient-to-r from-soft-pink to-light-pink rounded-2xl p-8 my-8">
              <p className="text-xl font-semibold text-gray-900 text-center">
                ✨ Ici, chaque cliente est une reine.
              </p>
              <p className="text-lg text-gray-700 text-center mt-4">
                Et chaque reine mérite une attention unique, un accompagnement sur mesure et une touche de glamour au quotidien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Queen&apos;s Glam, c&apos;est un engagement
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ces valeurs guident chacune de nos actions et définissent notre approche de la beauté et du bien-être.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="bg-soft-pink rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl font-semibold text-gray-900">
              Bienvenue dans un univers où chaque détail est pensé pour révéler la queen qui est en toi.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Un mot de la fondatrice
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-soft-pink to-light-pink rounded-2xl p-12">
            <div className="flex justify-center mb-6">
              <Quote className="h-12 w-12 text-primary-pink" />
            </div>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-center">
              <p>
                « J&apos;ai créé Queen&apos;s Glam avec le cœur. Parce que je crois que chaque femme mérite de se sentir belle, peu importe son style, son âge ou son histoire.
              </p>
              
              <p>
                À travers mes produits et mes services, je veux que tu sentes toute la bienveillance, la passion et l&apos;attention que j&apos;y mets.
              </p>
              
              <p>
                Merci de faire partie de cette belle aventure. »
              </p>
            </div>
            
            <div className="text-center mt-8">
              <div className="inline-flex items-center space-x-2">
                <span className="text-2xl">👑</span>
                <span className="font-elegant text-xl font-bold text-primary-pink">
                  — Anouchka
                </span>
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>
          
          {/* Founder's picture */}
          <div className="mt-12 text-center">
                          <div className="relative w-64 h-64 mx-auto">
                <Image
                  src="/founder.png"
                  alt="Anouchka Abegue Nguema ép Madouma - Fondatrice de Queen's Glam"
                  fill
                  className="rounded-full object-cover shadow-lg"
                  sizes="(max-width: 768px) 256px, 256px"
                />
              </div>
            <div className="mt-6 text-center">
              <h3 className="font-elegant text-2xl font-bold text-gray-900 mb-2">
                Anouchka Abegue Nguema ép Madouma
              </h3>
              <p className="text-primary-pink font-medium">
                Fondatrice de Queen&apos;s Glam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
              Rejoins l&apos;Univers Queen&apos;s Glam
            </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvre nos produits et services pour révéler la queen qui est en toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/produits" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Découvrir nos Produits
            </a>
            <a href="/services" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Nos Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 