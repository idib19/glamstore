'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShoppingBag, Star, Heart, Filter, Search, Plus, Minus } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'soins-visage', name: 'Soins du visage' },
    { id: 'maquillage', name: 'Maquillage' },
    { id: 'corps', name: 'Soins du corps' },
    { id: 'cheveux', name: 'Soins des cheveux' },
    { id: 'accessoires', name: 'Accessoires' }
  ];

  const products = [
    {
      id: 1,
      name: 'Crème Hydratante Intense',
      category: 'soins-visage',
      description: 'Hydratation 24h pour tous types de peau',
      price: 28.50,
      originalPrice: 35.00,
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true
    },
    {
      id: 2,
      name: 'Sérum Anti-âge',
      category: 'soins-visage',
      description: 'Sérum concentré pour préserver la jeunesse',
      price: 45.00,
      originalPrice: 55.00,
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: false
    },
    {
      id: 3,
      name: 'Fond de Teint Lumineux',
      category: 'maquillage',
      description: 'Fond de teint longue tenue et couvrant',
      price: 32.00,
      originalPrice: 32.00,
      rating: 4.7,
      reviews: 156,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true
    },
    {
      id: 4,
      name: 'Palette Ombre à Paupières',
      category: 'maquillage',
      description: '18 couleurs mattes et brillantes',
      price: 38.50,
      originalPrice: 45.00,
      rating: 4.6,
      reviews: 203,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: false
    },
    {
      id: 5,
      name: 'Gel Douche Nourrissant',
      category: 'corps',
      description: 'Gel douche enrichi en huiles essentielles',
      price: 18.00,
      originalPrice: 22.00,
      rating: 4.5,
      reviews: 78,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: false
    },
    {
      id: 6,
      name: 'Huile de Massage Relaxante',
      category: 'corps',
      description: 'Huile de massage aux essences naturelles',
      price: 25.00,
      originalPrice: 25.00,
      rating: 4.8,
      reviews: 92,
      image: '/api/placeholder/300/300',
      inStock: false,
      popular: false
    },
    {
      id: 7,
      name: 'Shampoing Hydratant',
      category: 'cheveux',
      description: 'Shampoing doux pour cheveux secs',
      price: 22.50,
      originalPrice: 28.00,
      rating: 4.4,
      reviews: 67,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: false
    },
    {
      id: 8,
      name: 'Pinceaux de Maquillage',
      category: 'accessoires',
      description: 'Set de 5 pinceaux professionnels',
      price: 35.00,
      originalPrice: 42.00,
      rating: 4.7,
      reviews: 134,
      image: '/api/placeholder/300/300',
      inStock: true,
      popular: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
              Nos{' '}
              <span className="text-primary-pink">Produits</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de produits de beauté de qualité, 
              soigneusement choisis pour prendre soin de vous.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              />
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
            <div className="flex items-center gap-4">
              <Link href="/panier" className="relative">
                <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-primary-pink transition-all" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <span className="text-sm text-gray-600">
                {cartItemCount} article{cartItemCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucun produit trouvé pour votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                  {product.popular && (
                    <div className="bg-primary-pink text-white text-center py-2 text-sm font-medium">
                      Populaire
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="bg-gray-500 text-white text-center py-2 text-sm font-medium">
                      Rupture de stock
                    </div>
                  )}
                  
                  <div className="h-48 bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                    <Heart className="h-16 w-16 text-primary-pink" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary-pink">
                          {product.price.toFixed(2)}€
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Add to Cart */}
                    <div className="flex items-center gap-2">
                      {cart[product.id] > 0 && (
                        <>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                            {cart[product.id]}
                          </span>
                        </>
                      )}
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                          product.inStock
                            ? 'btn-primary'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Nos Produits ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous sélectionnons avec soin chaque produit pour vous garantir qualité et efficacité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qualité Premium
              </h3>
              <p className="text-gray-600">
                Tous nos produits sont testés et approuvés par nos experts.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Naturel & Sûr
              </h3>
              <p className="text-gray-600">
                Formulations respectueuses de votre peau et de l'environnement.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-soft-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-pink" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Livraison Rapide
              </h3>
              <p className="text-gray-600">
                Livraison gratuite dès 50€ d'achat en France métropolitaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-pink to-rose-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin de Conseils ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour vous conseiller dans le choix de vos produits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary-pink px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Nous Contacter
            </Link>
            <Link href="/panier" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-pink transition-all">
              Voir le Panier
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 