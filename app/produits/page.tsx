'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShoppingBag, Star, Heart, Crown, Sparkles, Palette, CheckCircle } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');


  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'lip-gloss', name: 'Lip Gloss' },
    { id: 'masques-levres', name: 'Masques à Lèvres' },
    { id: 'perruques', name: 'Perruques Naturelles' }
  ];

  const products = [
    {
      id: 1,
      name: 'Lip Gloss Ultra Hydratant',
      category: 'lip-gloss',
      description: 'Fais briller tes lèvres avec notre gloss signature ✨',
      longDescription: 'Vegan et sans cruauté animale, il hydrate intensément tout en laissant un fini glowy et soyeux. Disponible en 10 teintes sublimes pour tous les tons de peau.',
      price: 12.99,
      currency: 'CAD',
      rating: 4.9,
      reviews: 156,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true,
      features: [
        'Texture non collante',
        'Parfum léger', 
        'Format pratique'
      ]
    },
    {
      id: 2,
      name: 'Lip Gloss Fini Matte',
      category: 'lip-gloss',
      description: 'L&apos;élégance du matte, sans compromis sur le confort.',
      longDescription: 'Notre gamme matte offre une couleur intense et une tenue longue durée, sans dessécher les lèvres. Disponible en 2 teintes élégantes.',
      price: 12.99,
      currency: 'CAD',
      rating: 4.8,
      reviews: 89,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: false,
      features: [
        'Fini matte élégant',
        'Tenue longue durée',
        'Confort optimal'
      ]
    },
    {
      id: 3,
      name: 'Masque à Lèvres',
      category: 'masques-levres',
      description: 'Ton rituel self-care du soir commence ici.',
      longDescription: 'Ce masque à lèvres riche et fondant est un soin de nuit pour des lèvres réparées et repulpées au réveil. Disponible en 3 saveurs gourmandes : fraise, bonbon et vanille.',
      price: 12.99,
      currency: 'CAD',
      rating: 4.9,
      reviews: 203,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true,
      features: [
        'Boost d&apos;hydratation',
        'Réduction des ridules',
        'Lèvres plus lisses, plus douces',
        'Nourrit et repulpe'
      ]
    },
    {
      id: 4,
      name: 'Perruques Naturelles Premium',
      category: 'perruques',
      description: 'Révèle ton style avec nos perruques 100 % cheveux naturels.',
      longDescription: 'Confort, élégance et durabilité réunis dans des modèles pensés pour t&apos;accompagner en toute confiance. Disponibles en plusieurs textures : lisse, ondulée, bouclée, kinky, afro etc. Options : Lace frontale, sans colle, avec colle, personnalisables à la demande.',
      price: null,
      currency: 'CAD',
      rating: 5.0,
      reviews: 67,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true,
      features: [
        'Faciles à coiffer',
        'Finition naturelle',
        'Effet "flawless"'
      ]
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesCategory;
  });

  const [cart, setCart] = useState<{[key: number]: number}>({});

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 0) {
        newCart[productId] -= 1;
        if (newCart[productId] === 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pale-pink to-soft-pink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-elegant text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ✨ Nos{' '}
              <span className="text-primary-pink">Produits</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Découvre nos essentiels signés Queen&apos;s Glam, conçus pour révéler ta beauté naturelle et ton éclat.
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

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-pink text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-soft-pink px-4 py-2 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-primary-pink" />
                <span className="text-gray-700 font-medium">
                  {cartItemCount} article{cartItemCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                {/* Product Image */}
                <div className="h-64 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center relative">
                  {product.popular && (
                    <div className="absolute top-4 left-4 bg-primary-pink text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✨ Populaire
                    </div>
                  )}
                  <div className="text-center">
                    <Palette className="h-16 w-16 text-primary-pink mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Image du produit</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name} – Queen&apos;s Glam
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {product.longDescription}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary-pink flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.price ? (
                        <span className="text-2xl font-bold text-primary-pink">
                          {product.price} $ {product.currency}
                        </span>
                      ) : (
                        <span className="text-lg font-semibold text-gray-700">
                          Prix sur demande
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {cart[product.id] > 0 && (
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all"
                        >
                          -
                        </button>
                      )}
                      
                      {cart[product.id] > 0 && (
                        <span className="text-gray-700 font-medium min-w-[20px] text-center">
                          {cart[product.id]}
                        </span>
                      )}
                      
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-primary-pink text-white px-4 py-2 rounded-lg font-medium hover:bg-dark-pink transition-all flex items-center space-x-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      {product.reviews} avis clients
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                <Sparkles className="h-16 w-16 text-primary-pink mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600">
                  Essaie de modifier tes critères de recherche.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              ✨ Pourquoi Choisir Queen&apos;s Glam ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos produits sont conçus avec amour pour révéler ta beauté naturelle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vegan & Cruelty-Free</h3>
              <p className="text-sm text-gray-600">Produits respectueux de l&apos;environnement et des animaux</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Qualité Premium</h3>
              <p className="text-sm text-gray-600">Formules soigneusement élaborées pour des résultats exceptionnels</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Effet Glam</h3>
              <p className="text-sm text-gray-600">Révèle ton éclat naturel avec nos produits signature</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            ✨ Prête à Révéler Ton Éclat ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvre nos produits et laisse la magie Queen&apos;s Glam opérer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Commander Maintenant
            </Link>
            <Link href="/services" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Nos Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 