'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Calendar, Instagram, Facebook, Twitter } from 'lucide-react';
import { useCart } from '../lib/cartContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();

  const menuItems = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/services' },
    { name: 'Produits', href: '/produits' },
    { name: 'Avis clients', href: '/avis' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-soft-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QG</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Queen&apos;s Glam</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-pink px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Links */}
            <div className="flex items-center space-x-3">
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

            {/* Action Buttons */}
            <Link
              href="/panier"
              className="text-gray-700 hover:text-primary-pink transition-all relative"
              aria-label="Panier"
            >
              <ShoppingBag className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                </span>
              )}
            </Link>
            <Link
              href="/rendez-vous"
              className="btn-primary text-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Rendez-vous
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-pink focus:outline-none focus:text-primary-pink"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-soft-pink">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-pink block px-3 py-2 rounded-md text-base font-medium transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-soft-pink">
              <div className="flex items-center justify-center space-x-4">
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
              <div className="mt-4 flex flex-col space-y-2">
                <Link
                  href="/panier"
                  className="btn-secondary text-center relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2 inline" />
                  Panier
                  {getCartItemCount() > 0 && (
                    <span className="ml-2 bg-primary-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                    </span>
                  )}
                </Link>
                <Link
                  href="/rendez-vous"
                  className="btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  Rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 