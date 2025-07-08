'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { ShoppingBag, Star, Heart, Crown, Sparkles, Palette, CheckCircle } from 'lucide-react';
import { productsApi, categoriesApi, supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

// Use a type that includes images

type ProductWithImages = Database['public']['Tables']['products']['Row'] & {
  product_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  product_images: {
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{[key: string]: number}>({});

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await categoriesApi.getAll();
        const categoriesWithAll = [
          { id: 'all', name: 'Tous les produits', slug: 'all' },
          ...categoriesData
        ];
        setCategories(categoriesWithAll);
        
        // Fetch products with images
        const productsData = await productsApi.getAll();
        setProducts(productsData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time subscription for products
  useEffect(() => {
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
          console.log('Product change detected:', payload);
          // Refresh products data
          try {
            const productsData = await productsApi.getAll();
            setProducts(productsData);
          } catch (err) {
            console.error('Error refreshing products:', err);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        async (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
          console.log('Review change detected:', payload);
          // Refresh products data to update ratings
          try {
            const productsData = await productsApi.getAll();
            setProducts(productsData);
          } catch (err) {
            console.error('Error refreshing products:', err);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.product_categories?.slug === selectedCategory;
    return matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
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

  // Helper function to get product features based on category
  const getProductFeatures = (product: ProductWithImages) => {
    const features: { [key: string]: string[] } = {
      'lip-gloss': [
        'Texture non collante',
        'Parfum léger', 
        'Format pratique'
      ],
      'masques-levres': [
        'Boost d\'hydratation',
        'Réduction des ridules',
        'Lèvres plus lisses, plus douces',
        'Nourrit et repulpe'
      ],
      'perruques': [
        'Faciles à coiffer',
        'Finition naturelle',
        'Effet "flawless"'
      ]
    };
    
    return features[product.product_categories?.slug || ''] || [
      'Qualité premium',
      'Résultats garantis',
      'Satisfaction client'
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary-pink text-white px-6 py-2 rounded-lg hover:bg-dark-pink transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
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
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.slug
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
                  {product.product_images && product.product_images.length > 0 ? (
                    <img
                      src={product.product_images[0].image_url}
                      alt={product.product_images[0].alt_text || product.name}
                      className="h-64 w-full object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center">
                      <Palette className="h-16 w-16 text-primary-pink mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Image du produit</p>
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-primary-pink text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✨ Populaire
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name} – {product.product_categories?.name || 'Queen\'s Glam'}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        N/A
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {product.short_description}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-2">
                      {getProductFeatures(product).map((feature, index) => (
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
                          {product.price.toFixed(2)} €
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
                      0 avis clients
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