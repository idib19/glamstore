'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Clock, Crown, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8 text-primary-pink" />,
      title: 'Email',
      content: 'admin@queensglam.ca',
      link: 'mailto:admin@queensglam.ca'
    },
    {
      icon: <Phone className="h-8 w-8 text-primary-pink" />,
      title: 'WhatsApp / Téléphone',
      content: '+1 819-639-6386 (Canada)\n+241 04 02 64 89 (Gabon)',
      link: 'tel:+18196396386'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary-pink" />,
      title: 'Localisation',
      content: 'Basée à Gatineau (QC)\nLivraison partout au Canada et à l&apos;international',
      link: null
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-pink" />,
      title: 'Horaires',
      content: 'Réponse rapide du lundi au samedi\n10h à 18h',
      link: null
    }
  ];

  const socialMedia = [
    {
      name: 'TikTok',
      handle: '@queensglam06',
      link: 'https://tiktok.com/@queensglam06',
      icon: '🎵'
    },
    {
      name: 'Instagram',
      handle: '@queensglam066',
      link: 'https://instagram.com/queensglam066',
      icon: '📸'
    },
    {
      name: 'Facebook',
      handle: 'Queen&apos;s Glam',
      link: 'https://facebook.com/queensglam',
      icon: '📘'
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
              Nous{' '}
              <span className="text-primary-pink">Joindre</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ✨ Une question ? Un besoin particulier ? Parlons-en !
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Chez Queen&apos;s Glam, nous sommes toujours ravis de vous lire. Que ce soit pour un conseil beauté, une demande spéciale ou simplement pour nous dire bonjour, votre message sera toujours le bienvenu.
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

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Nos Coordonnées
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Basée à Gatineau (QC), nous livrons partout au Canada, et à l&apos;international.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-primary-pink transition-all whitespace-pre-line"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">
                    {info.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Suivez-nous sur les Réseaux Sociaux
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Envoyez-nous un message via nos réseaux sociaux :
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="text-4xl mb-4">{social.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {social.name}
                </h3>
                <p className="text-primary-pink font-medium">
                  {social.handle}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Queen&apos;s Glam Message */}
      <section className="py-16 bg-gradient-to-r from-soft-pink to-light-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="flex justify-center mb-6">
              <Crown className="h-16 w-16 text-primary-pink" />
            </div>
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-6">
              ✨ Chez Queen&apos;s Glam, chaque cliente est traitée comme une reine.
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nous sommes là pour vous accompagner dans votre quête de beauté et de confiance. 
              N&apos;hésitez pas à nous contacter pour toute question ou demande spéciale.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 