'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Crème Hydratante Intense',
      price: 28.50,
      quantity: 2,
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Fond de Teint Lumineux',
      price: 32.00,
      quantity: 1,
      image: '/api/placeholder/100/100'
    },
    {
      id: 8,
      name: 'Pinceaux de Maquillage',
      price: 35.00,
      quantity: 1,
      image: '/api/placeholder/100/100'
    }
  ]);

  const [checkoutData, setCheckoutData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.20; // 20% TVA
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset cart after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setCartItems([]);
      setCheckoutData({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      });
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Commande Confirmée !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre commande a été enregistrée avec succès. Nous vous enverrons un email de confirmation 
                avec tous les détails de votre commande. Notre équipe vous contactera pour finaliser le paiement.
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h3>
                <div className="text-left space-y-2 text-sm">
                  <p><strong>Total :</strong> {total.toFixed(2)}€</p>
                  <p><strong>Articles :</strong> {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p><strong>Email :</strong> {checkoutData.email}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/" className="btn-primary">
                  Retour à l&apos;Accueil
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-pale-pink rounded-lg p-8">
              <ShoppingBag className="h-16 w-16 text-primary-pink mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Votre Panier est Vide
              </h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos produits de beauté et commencez votre shopping !
              </p>
              <Link href="/produits" className="btn-primary">
                Découvrir nos Produits
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre{' '}
              <span className="text-primary-pink">Panier</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Finalisez votre commande et profitez de nos produits de beauté de qualité.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Articles ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-soft-pink to-light-pink rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-primary-pink" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-primary-pink font-bold">{item.price.toFixed(2)}€</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-all mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-pale-pink rounded-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Récapitulatif
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Sous-total :</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%) :</span>
                    <span>{tax.toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total :</span>
                      <span className="text-primary-pink">{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  * Livraison gratuite dès 50€ d&apos;achat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de Livraison
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={checkoutData.firstName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={checkoutData.lastName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={checkoutData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={checkoutData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de livraison *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="123 Rue de la Beauté"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={checkoutData.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Paris"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={checkoutData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="75001"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={checkoutData.country}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="France"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informations importantes :</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aucun paiement en ligne - confirmation manuelle par la fondatrice</li>
                  <li>• Livraison gratuite dès 50€ d&apos;achat</li>
                  <li>• Délai de livraison : 3-5 jours ouvrés</li>
                  <li>• Vous recevrez un email de confirmation après validation</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      Confirmer la Commande
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d&apos;Aide ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans votre commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Nous Contacter
            </Link>
            <Link href="/produits" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Continuer les Achats
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 