'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Eye, Package, X, AlertTriangle } from 'lucide-react';
import { productsApi, supabase } from '../lib/supabase';
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

interface ProductsTableProps {
  refreshTrigger?: number; // Add a trigger prop for manual refresh
}

export default function ProductsTable({ refreshTrigger }: ProductsTableProps) {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: ProductWithImages | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    product: null,
    isDeleting: false
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Manual refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      refreshProducts();
    }
  }, [refreshTrigger]);

  // Real-time subscription for products
  useEffect(() => {
    const channel = supabase
      .channel('dashboard_products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
          console.log('Product change detected in dashboard:', payload);
          // Refresh products data immediately
          try {
            await refreshProducts();
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
          console.log('Review change detected in dashboard:', payload);
          // Refresh products data to update ratings
          try {
            await refreshProducts();
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productsApi.getAll();
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    try {
      setRefreshing(true);
      const productsData = await productsApi.getAll();
      setProducts(productsData);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError('Erreur lors du rafraîchissement des produits');
    } finally {
      setRefreshing(false);
    }
  };

  const openDeleteModal = (product: ProductWithImages) => {
    setDeleteModal({
      isOpen: true,
      product,
      isDeleting: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      product: null,
      isDeleting: false
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));
      await productsApi.delete(deleteModal.product.id);
      await fetchProducts(); // Refresh the list
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erreur lors de la suppression du produit');
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const getStockStatus = (inStock: boolean | null) => {
    if (inStock === null) return { text: 'N/A', class: 'bg-gray-100 text-gray-800' };
    return inStock 
      ? { text: 'En stock', class: 'bg-green-100 text-green-800' }
      : { text: 'Rupture', class: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Package className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchProducts} 
          className="bg-primary-pink text-white px-4 py-2 rounded-lg hover:bg-dark-pink transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        {/* Refresh indicator */}
        {refreshing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-blue-700 text-sm">Actualisation des produits...</span>
          </div>
        )}
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun produit trouvé</p>
                    <p className="text-sm">Commencez par ajouter votre premier produit</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product.in_stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.product_images && product.product_images.length > 0 ? (
                            <Image
                              src={product.product_images[0].image_url}
                              alt={product.product_images[0].alt_text || product.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              loading="lazy"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center ${product.product_images && product.product_images.length > 0 ? 'hidden' : ''}`}>
                            <Package className="h-5 w-5 text-primary-pink" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                            {product.is_featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-pink text-white">
                                ✨ Vedette
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                          {product.brand && (
                            <div className="text-sm text-gray-500">
                              {product.brand}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.product_categories?.name || 'Non catégorisé'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.price ? `${product.price.toFixed(2)}€` : 'Sur demande'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.class}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-primary-pink hover:text-dark-pink transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(product)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer la suppression
                </h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={deleteModal.isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 h-16 w-16 mr-4">
                  {deleteModal.product.product_images && deleteModal.product.product_images.length > 0 ? (
                    <Image
                      src={deleteModal.product.product_images[0].image_url}
                      alt={deleteModal.product.product_images[0].alt_text || deleteModal.product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-soft-pink to-light-pink flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary-pink" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900 mb-1">
                    {deleteModal.product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    SKU: {deleteModal.product.sku}
                  </p>
                  {deleteModal.product.brand && (
                    <p className="text-sm text-gray-500">
                      {deleteModal.product.brand}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera définitivement le produit de votre catalogue.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={deleteModal.isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                disabled={deleteModal.isDeleting}
              >
                {deleteModal.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  'Supprimer définitivement'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 