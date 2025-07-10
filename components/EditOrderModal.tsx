'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { ordersApi } from '../lib/supabase';

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
  }>;
}

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderUpdated: () => void;
}

export default function EditOrderModal({ isOpen, onClose, order, onOrderUpdated }: EditOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'pending' as 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
    payment_status: 'pending' as 'pending' | 'paid' | 'failed' | 'refunded',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && order) {
      setFormData({
        status: order.status as 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded',
        payment_status: order.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        notes: order.notes || ''
      });
    }
  }, [isOpen, order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsLoading(true);
    try {
      await ordersApi.update(order.id, {
        status: formData.status,
        payment_status: formData.payment_status,
        notes: formData.notes || null
      });

      onOrderUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'waiting_for_payment', label: 'En attente de paiement' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' },
    { value: 'refunded', label: 'Remboursée' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payé' },
    { value: 'failed', label: 'Échoué' },
    { value: 'refunded', label: 'Remboursé' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier la Commande #{order.order_number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informations Client</h3>
              <p className="text-sm text-gray-600">
                {order.customers ? 
                  `${order.customers.first_name} ${order.customers.last_name}` : 
                  order.customer_name || 'Client non enregistré'
                }
              </p>
              <p className="text-sm text-gray-600">
                {order.customers?.email || order.customer_email}
              </p>
              <p className="text-sm text-gray-600">
                {order.customers?.phone || order.customer_phone}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Montants</h3>
                              <p className="text-sm text-gray-600">Sous-total: {order.subtotal} CAD</p>
                <p className="text-sm text-gray-600">Taxes: {order.tax_amount} CAD</p>
                <p className="text-sm text-gray-600">Livraison: {order.shipping_amount} CAD</p>
                <p className="text-sm text-gray-600">Réduction: {order.discount_amount} CAD</p>
                <p className="font-medium text-gray-900">Total: {order.total_amount} CAD</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Articles</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {item.unit_price} CAD
                    </p>
                  </div>
                                      <p className="font-medium text-gray-900">{item.total_price} CAD</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut de la commande
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut du paiement
              </label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as 'pending' | 'paid' | 'failed' | 'refunded' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                required
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              placeholder="Ajouter des notes sur cette commande..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-pink text-white rounded-md hover:bg-dark-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 