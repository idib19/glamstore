'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit, Eye, X, Calendar, User, Phone, Mail, MapPin, Package, CreditCard, FileText, Image as LucideImage } from 'lucide-react';
import { ordersApi } from '../../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  shipping_address: string | null;
  billing_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  order_items?: Array<{
    id: string;
    product_id: string | null;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: {
      id: string;
      name: string;
      brand: string | null;
      product_images?: Array<{
        id: string;
        image_url: string;
        alt_text: string | null;
        is_primary: boolean;
        sort_order: number;
      }>;
    };
  }>;
}

interface OrdersProps {
  onEditOrder: (order: Order) => void;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

interface ProductImageGalleryProps {
  images: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }>;
  productName: string;
}

// Product Image Gallery Component
function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  if (!images || images.length === 0) return null;

  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <>
      {/* Main Image */}
      <div className="relative group cursor-pointer" onClick={() => setShowGallery(true)}>
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || productName}
            width={64}
            height={64}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
            <LucideImage className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute -top-1 -right-1 bg-primary-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {images.length}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Main Image */}
              <div className="mb-4">
                <Image
                  src={images[selectedImageIndex].image_url}
                  alt={images[selectedImageIndex].alt_text || `${productName} - Image ${selectedImageIndex + 1}`}
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex 
                          ? 'border-primary-pink' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || `${productName} - Image ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waiting_for_payment': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'waiting_for_payment': return 'En attente de paiement';
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Commande #{order.order_number}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Créée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Statut de la Commande</h3>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Statut du Paiement</h3>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                {getPaymentStatusLabel(order.payment_status)}
              </span>
              {order.payment_method && (
                <p className="text-sm text-gray-600 mt-2">
                  Méthode: {order.payment_method}
                </p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Informations Client</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Nom</p>
                <p className="text-gray-900">
                  {order.customers ? 
                    `${order.customers.first_name} ${order.customers.last_name}` : 
                    order.customer_name || 'Client non enregistré'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <p className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  {order.customers?.email || order.customer_email || 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Téléphone</p>
                <p className="text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  {order.customers?.phone || order.customer_phone || 'Non renseigné'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">ID Client</p>
                <p className="text-gray-900">
                  {order.customer_id || 'Client non enregistré'}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {(order.shipping_address || order.billing_address) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {order.shipping_address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Adresse de Livraison</h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
                </div>
              )}
              {order.billing_address && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Adresse de Facturation</h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{order.billing_address}</p>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Articles Commandés</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {order.order_items.map((item) => {
                  const productImages = item.products?.product_images || [];
                  
                  return (
                    <div key={item.id} className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {productImages.length > 0 ? (
                            <ProductImageGallery 
                              images={productImages} 
                              productName={item.product_name} 
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <LucideImage className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.product_name}</h4>
                          {item.product_sku && (
                            <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} × {item.unit_price.toFixed(2)}€
                          </p>
                          {item.products?.brand && (
                            <p className="text-xs text-gray-500">Marque: {item.products.brand}</p>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900">{item.total_price.toFixed(2)}€</p>
                          <p className="text-sm text-gray-600">Prix unitaire: {item.unit_price.toFixed(2)}€</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {order.order_items?.length || 0} article{order.order_items?.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.order_items?.reduce((total: number, item) => total + item.quantity, 0) || 0} unité{order.order_items?.reduce((total: number, item) => total + item.quantity, 0) !== 1 ? 's' : ''} au total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-xl font-bold text-gray-900">{order.total_amount.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif des Montants</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{order.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">{order.tax_amount.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{order.shipping_amount.toFixed(2)}€</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span className="font-medium">-{order.discount_amount.toFixed(2)}€</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">{order.total_amount.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Créée le: {new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            {order.updated_at !== order.created_at && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Modifiée le: {new Date(order.updated_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders({ onEditOrder }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Load orders data
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Commandes</h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
              <span className="ml-2 text-gray-600">Chargement des commandes...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune commande trouvée
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Commande #{order.order_number}</h4>
                        <p className="text-sm text-gray-600">
                          Client: {order.customers ? 
                            `${order.customers.first_name} ${order.customers.last_name}` : 
                            order.customer_name || 'Client non enregistré'
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.total_amount}€</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'pending' ? 'En attente' :
                           order.status === 'confirmed' ? 'Confirmée' :
                           order.status === 'delivered' ? 'Livrée' :
                           order.status === 'cancelled' ? 'Annulée' :
                           order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="btn-secondary text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </button>
                      <button 
                        onClick={() => onEditOrder(order)}
                        className="btn-primary text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        order={selectedOrder}
      />
    </>
  );
} 