'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { ChevronDown, ChevronUp, Crown, Sparkles, Heart, Truck, CreditCard, MapPin, Scissors } from 'lucide-react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      id: 1,
      question: 'Est-ce que vos lip gloss et masques à lèvres sont vegan ?',
      answer: 'Oui ! Tous nos lip gloss et masques à lèvres sont vegan et sans cruauté animale. On prend soin de vous… et de la planète 🌱',
      icon: <Heart className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 2,
      question: 'Livrez-vous au Canada et à l\'international ?',
      answer: 'Oui, nous livrons partout au Canada, ainsi que dans le reste du monde. Les frais et délais varient selon la destination.',
      icon: <Truck className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 3,
      question: 'Quels sont les délais de livraison ?',
      answer: '• Canada : 3 à 7 jours ouvrables\n• International : 7 à 14 jours ouvrables\n\nLes délais peuvent varier selon les périodes et les transporteurs.',
      icon: <Truck className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 4,
      question: 'Vos perruques sont-elles en vrais cheveux ?',
      answer: 'Oui, nos perruques sont faites à partir de cheveux 100 % naturels. Elles sont durables, personnalisables, et peuvent être teintées, coiffées ou stylisées à ta convenance.',
      icon: <Crown className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 5,
      question: 'Comment prendre rendez-vous pour un service ?',
      answer: 'Tu peux réserver directement en ligne via notre page "Prise de rendez-vous". Un message de confirmation te sera envoyé une fois la réservation validée.',
      icon: <Crown className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 6,
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons :\n\n• Virement Interac\n• Paiement par PayPal\n• Espèces (pour les services en présentiel)',
      icon: <CreditCard className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 7,
      question: 'Puis-je retourner ou échanger un produit ?',
      answer: 'Par souci d&apos;hygiène, les gloss, masques à lèvres et perruques ne sont ni repris ni échangés. Mais si tu rencontres un problème, contacte-nous ! On trouvera une solution avec toi 💕',
      icon: <Heart className="h-6 w-6 text-primary-pink" />
    },
    {
      id: 8,
      question: 'Où êtes-vous situés ?',
      answer: 'Nous sommes basés à Gatineau, Québec (Canada). L&apos;adresse exacte est transmise après confirmation de rendez-vous.',
      icon: <MapPin className="h-6 w-6 text-primary-pink" />
    }
  ];

  const careTips = [
    {
      title: '✨ Entretien quotidien & hebdomadaire',
      tips: [
        'Démêlez délicatement la perruque avec un peigne à larges dents ou avec les doigts avant et après chaque port.',
        'Rangez-la sur un porte-perruque pour éviter les nœuds et conserver sa forme.',
        'Évitez de dormir avec votre perruque afin de préserver la lace et la texture.'
      ]
    },
    {
      title: '🛁 Lavage & soins',
      tips: [
        'Utilisez un shampoing sans sulfate et un revitalisant hydratant.',
        'Laissez-la sécher à l&apos;air libre sur un support — ne frottez jamais avec une serviette.'
      ]
    },
    {
      title: '💇‍♀️ Coiffage',
      tips: [
        'Utilisez des outils chauffants à basse température.',
        'Appliquez toujours un spray protecteur thermique avant l\'utilisation du fer ou du lisseur.',
        'Pour boucler sans chaleur, privilégiez les rouleaux ou flexi-rods.'
      ]
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
              ✨ Foire aux questions{' '}
              <span className="text-primary-pink">(FAQ)</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Queen&apos;s Glam
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Trouve rapidement les réponses à tes questions sur nos produits et services.
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-soft-pink rounded-full w-10 h-10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.question}
                    </h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-primary-pink" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-pink" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Tips Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Conseils d&apos;entretien – Garder votre perruque impeccable
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Que vous portiez votre perruque tous les jours ou seulement pour des occasions spéciales, 
              voici nos conseils pro pour la garder belle, douce et durable :
            </p>
          </div>
          
          <div className="space-y-8">
            {careTips.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-soft-pink rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Scissors className="h-6 w-6 text-primary-pink" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {section.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start space-x-3">
                      <div className="bg-primary-pink rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            ✨ Tu ne trouves pas ta réponse ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            N&apos;hésite pas à nous contacter directement. Notre équipe est là pour t&apos;aider !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Nous Contacter
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