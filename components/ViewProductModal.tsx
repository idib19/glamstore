'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Package, Calendar, Tag, DollarSign, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Database } from '../types/database';

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

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithImages | null;
}

export default function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  if (!isOpen || !product) return null;

  const allImages = product.product_images || [];
  const sortedImages = allImages.sort((a, b) => a.sort_order - b.sort_order);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockStatus = (inStock: boolean | null) => {
    if (inStock === null) return { text: 'N/A', class: 'bg-gray-100 text-gray-800' };
    return inStock 
      ? { text: 'En stock', class: 'bg-green-100 text-green-800' }
      : { text: 'Rupture', class: 'bg-red-100 text-red-800' };
  };

  const stockStatus = getStockStatus(product.in_stock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-pink rounded-full p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Détails du Produit
              </h2>
              <p className="text-sm text-gray-500">
                Aperçu complet des informations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary-pink" />
                Images du Produit
              </h3>
              
              {sortedImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative">
                    <Image
                      src={sortedImages[currentImageIndex]?.image_url || ''}
                      alt={sortedImages[currentImageIndex]?.alt_text || product.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover rounded-lg border border-gray-200"
                      loading="lazy"
                    />
                    {sortedImages[currentImageIndex]?.is_primary && (
                      <div className="absolute top-2 left-2 bg-primary-pink text-white text-xs px-2 py-1 rounded">
                        Image principale
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {sortedImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {sortedImages.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-primary-pink'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={image.image_url}
                            alt={image.alt_text || `Image ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-20 object-cover"
                            loading="lazy"
                          />
                          {image.is_primary && (
                            <div className="absolute top-1 left-1 bg-primary-pink text-white text-xs px-1 py-0.5 rounded">
                              P
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 bg-gradient-to-br from-soft-pink to-light-pink rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-16 w-16 text-primary-pink mx-auto mb-4" />
                    <p className="text-gray-600">Aucune image disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                    {product.is_featured && (
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-pink text-white">
                        <Heart className="h-4 w-4 mr-1" />
                        En vedette
                      </span>
                    )}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      SKU: {product.sku}
                    </span>
                    {product.brand && (
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {product.brand}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Catégorie:</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {product.product_categories?.name || 'Non catégorisé'}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-pink" />
                  Informations de Prix
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Prix normal</span>
                    <p className="text-xl font-bold text-gray-900">
                      {product.price ? `${product.price.toFixed(2)} CAD` : 'Sur demande'}
                    </p>
                  </div>
                  
                  {product.sale_price && (
                    <div>
                      <span className="text-sm text-gray-500">Prix de vente</span>
                      <p className="text-xl font-bold text-red-600">
                        {product.sale_price.toFixed(2)} CAD
                      </p>
                      <p className="text-sm text-gray-500">
                        Économisez {((product.price - product.sale_price) / product.price * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary-pink" />
                  Statut du Stock
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Disponibilité</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.class}`}>
                    {stockStatus.text}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description Courte
                  </h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                    {product.short_description || 'Aucune description courte disponible'}
                  </p>
                </div>

                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description Complète
                    </h3>
                    <div className="text-gray-700 bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {product.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
                  <Calendar className="h-5 w-5 mr-2 text-primary-pink" />
                  Informations Temporelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Créé le</span>
                    <p className="text-gray-900 font-medium">
                      {formatDate(product.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Dernière modification</span>
                    <p className="text-gray-900 font-medium">
                      {formatDate(product.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
} 