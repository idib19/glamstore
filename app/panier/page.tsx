'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../../lib/cartContext';
import { emailService } from '../../lib/emailService';

interface OrderDetails {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function CartPage() {
  const { 
    state, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemCount, 
    createOrder 
  } = useCart();

  const [checkoutData, setCheckoutData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create order in database
      const order = await createOrder(checkoutData);
      setOrderDetails(order);

      // Send confirmation email
      try {
        await emailService.sendOrderConfirmation({
          customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
          customerEmail: checkoutData.email,
          orderNumber: order.order_number,
          orderTotal: order.total_amount,
          orderItems: state.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity
          })),
          shippingAddress: `${checkoutData.address}, ${checkoutData.postalCode} ${checkoutData.city}, ${checkoutData.country}`
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.20; // 20% TVA
  const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping over 50 CAD
  const total = subtotal + tax + shipping;

  if (isSubmitted && orderDetails) {
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
                  <p><strong>Numéro de commande :</strong> {orderDetails.order_number}</p>
                  <p><strong>Total :</strong> {orderDetails.total_amount.toFixed(2)} CAD</p>
                  <p><strong>Articles :</strong> {getCartItemCount()}</p>
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

  if (state.items.length === 0) {
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
                Articles ({getCartItemCount()})
              </h2>
              
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-soft-pink to-light-pink rounded-lg flex items-center justify-center">
                        {item.product.product_images && item.product.product_images.length > 0 ? (
                          <Image 
                            src={item.product.product_images[0].image_url} 
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-primary-pink" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.product.product_categories?.name}
                        </p>
                        <p className="text-primary-pink font-bold">{item.product.price.toFixed(2)} CAD</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{(item.product.price * item.quantity).toFixed(2)} CAD</p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
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
                    <span>{subtotal.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%) :</span>
                    <span>{tax.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison :</span>
                    <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} CAD`}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total :</span>
                      <span className="text-primary-pink">{total.toFixed(2)} CAD</span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                                      <strong>Livraison gratuite</strong> dès 50 CAD d&apos;achat !
                Il vous manque {(50 - subtotal).toFixed(2)} CAD.
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-4">
                  * Livraison gratuite dès 50 CAD d&apos;achat
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
            
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-800">{state.error}</p>
                </div>
              </div>
            )}
            
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

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={checkoutData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input"
                  placeholder="Informations supplémentaires pour votre commande..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informations importantes :</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aucun paiement en ligne - confirmation manuelle par la fondatrice</li>
                  <li>• Livraison gratuite dès 50 CAD d&apos;achat</li>
                  <li>• Délai de livraison : 3-5 jours ouvrés</li>
                  <li>• Vous recevrez un email de confirmation après validation</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || state.isLoading}
                  className={`btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto ${
                    (isSubmitting || state.isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {(isSubmitting || state.isLoading) ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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