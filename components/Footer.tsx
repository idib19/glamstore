import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

// TikTok Icon Component
const TikTokIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/queensglam066', icon: Instagram },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61561036134049', icon: Facebook },
      { name: 'TikTok', href: 'https://www.tiktok.com/@queensglam06', icon: TikTokIcon },
  ];

  const quickLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/services' },
    { name: 'Produits', href: '/produits' },
    { name: 'Avis clients', href: '/avis' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'Soins du visage', href: '/services#soins-visage' },
    { name: 'Maquillage', href: '/services#maquillage' },
    { name: 'Manucure', href: '/services#manucure' },
    { name: 'Massages', href: '/services#massages' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/dashboard" className="block hover:opacity-80 transition-opacity mb-6">
              <div className="mb-6">
                <h3 className="font-elegant text-2xl font-bold text-primary-pink mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-pink rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">QG</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Queen&apos;s Glam</span>
                  </div>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Votre destination beauté et bien-être. Nous vous accompagnons dans votre quête de beauté naturelle et authentique.
                </p>
              </div>
            </Link>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-pink transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-pink">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-pink transition-all text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-pink">Nos Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-primary-pink transition-all text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-pink">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-pink" />
                <span className="text-gray-300 text-sm">
                  123 Rue de la Beauté<br />
                  75001 Paris, France
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-pink" />
                <span className="text-gray-300 text-sm">
                  +33 1 23 45 67 89
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary-pink" />
                <span>admin@queensglam.ca</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <Link
                href="/rendez-vous"
                className="btn-primary text-sm block text-center"
              >
                Prendre RDV
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-sm block text-center"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Queen&apos;s Glam. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-gray-400 hover:text-primary-pink text-sm">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-gray-400 hover:text-primary-pink text-sm">
                Politique de confidentialité
              </Link>
              <Link href="/conditions-utilisation" className="text-gray-400 hover:text-primary-pink text-sm">
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 