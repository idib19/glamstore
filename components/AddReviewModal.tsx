'use client';

import { useState, useEffect } from 'react';
import { X, Star, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react';
import { reviewsApi, servicesApi, productsApi } from '../lib/supabase';
import { Database } from '../types/database';

type Service = Database['public']['Tables']['services']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export default function AddReviewModal({ isOpen, onClose, onReviewSubmitted }: AddReviewModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    service_id: '',
    product_id: '',
    rating: 5,
    title: '',
    comment: ''
  });

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch services and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, productsData] = await Promise.all([
          servicesApi.getAll(),
          productsApi.getAll()
        ]);
        setServices(servicesData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      customer_name: '',
      service_id: '',
      product_id: '',
      rating: 5,
      title: '',
      comment: ''
    });
    setErrors({});
    setError(null);
    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Le nom est requis';
    }

    if (!formData.service_id && !formData.product_id) {
      newErrors.service_id = 'Veuillez sélectionner un service ou un produit';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Le commentaire est requis';
    }

    if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }

    if (formData.comment.trim().length > 1000) {
      newErrors.comment = 'Le commentaire ne peut pas dépasser 1000 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reviewData = {
        customer_name: formData.customer_name.trim(),
        service_id: formData.service_id || null,
        product_id: formData.product_id || null,
        rating: formData.rating,
        title: formData.title.trim() || null,
        comment: formData.comment.trim(),
        is_approved: false, // Reviews need approval by admin
        is_verified: false
      };

      await reviewsApi.create(reviewData);
      
      setSuccess(true);
      
      // Call the callback to refresh the reviews
      onReviewSubmitted();
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: unknown) {
      console.error('Error submitting review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la soumission de l\'avis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-soft-pink rounded-full p-2">
                  <MessageCircle className="h-6 w-6 text-primary-pink" />
                </div>
                <div>
                  <h2 className="font-elegant text-2xl font-bold text-gray-900">
                    ✨ Laisser un avis
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Partage ton expérience Queen&apos;s Glam
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

            {/* Success Message */}
            {success && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg mx-6 mt-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Merci pour ton avis ! ✨
                    </h3>
                    <p className="text-green-700 text-sm">
                      Ton avis a été soumis avec succès et sera publié après approbation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg mx-6 mt-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Erreur
                    </h3>
                    <p className="text-red-700 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Name */}
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ton nom *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                    errors.customer_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Marie L."
                />
                {errors.customer_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Service testé
                </label>
                <select
                  id="service_id"
                  value={formData.service_id}
                  onChange={(e) => handleInputChange('service_id', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                    errors.service_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_id}</p>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Produit testé
                </label>
                <select
                  id="product_id"
                  value={formData.product_id}
                  onChange={(e) => handleInputChange('product_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-semibold text-gray-700">
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              {/* Title (Optional) */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  placeholder="Ex: Expérience exceptionnelle !"
                  maxLength={255}
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Ton avis *
                </label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent resize-none ${
                    errors.comment ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Raconte-nous ton expérience Queen's Glam..."
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.comment && (
                    <p className="text-sm text-red-600">{errors.comment}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.comment.length}/1000
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary-pink text-white rounded-lg hover:bg-dark-pink transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      <span>Envoyer l&apos;avis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 