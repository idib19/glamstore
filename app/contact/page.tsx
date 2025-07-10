'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Clock, Crown, Sparkles } from 'lucide-react';

// Social Media Icons Components
const TikTokIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const InstagramIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

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
      content: "Basée à Gatineau (QC)\nLivraison partout au Canada et à l'international",
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
      icon: <TikTokIcon className="h-12 w-12 text-black" />
    },
    {
      name: 'Instagram',
      handle: '@queensglam066',
      link: 'https://instagram.com/queensglam066',
      icon: <InstagramIcon className="h-12 w-12 text-pink-600" />
    },
    {
      name: 'Facebook',
      handle: 'Queen&apos;s Glam',
      link: 'https://facebook.com/queensglam',
      icon: <FacebookIcon className="h-12 w-12 text-blue-600" />
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
                <div className="flex justify-center mb-4">{social.icon}</div>
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