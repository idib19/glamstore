'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, MessageCircle, AlertCircle } from 'lucide-react';
import { reviewsApi } from '../../lib/supabase';
import { Database } from '../../types/database';
import ConfirmDialog from '../ConfirmDialog';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  products?: {
    id: string;
    name: string;
  } | null;
  services?: {
    id: string;
    name: string;
  } | null;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  // const [processing, setProcessing] = useState(false);

  // Fetch all reviews (including pending ones)
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await reviewsApi.getAllForAdmin();
      setReviews(reviewsData || []);
    } catch (err: unknown) {
      console.error('Error fetching reviews:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des avis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (review: Review) => {
    setSelectedReview(review);
    setActionType('approve');
    setShowConfirmDialog(true);
  };

  const handleReject = async (review: Review) => {
    setSelectedReview(review);
    setActionType('reject');
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedReview || !actionType) return;

    try {
      await reviewsApi.update(selectedReview.id, {
        is_approved: actionType === 'approve'
      });

      // Refresh the reviews list
      await fetchReviews();
      
      setShowConfirmDialog(false);
      setSelectedReview(null);
      setActionType(null);
    } catch (err: unknown) {
      console.error('Error updating review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'avis';
      setError(errorMessage);
    }
  };

  const getStatusBadge = (review: Review) => {
    if (review.is_approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approuvé
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          En attente
        </span>
      );
    }
  };

  const getReviewType = (review: Review) => {
    if (review.service_id) {
      return review.services?.name || 'Service';
    } else if (review.product_id) {
      return review.products?.name || 'Produit';
    }
    return 'Général';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Avis</h2>
          <p className="text-gray-600">
            {reviews.length} avis au total • {reviews.filter(r => !r.is_approved).length} en attente d&apos;approbation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary-pink" />
          <span className="text-sm font-medium text-gray-700">Avis</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commentaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun avis trouvé</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {review.customer_name || `${review.customers?.first_name || ''} ${review.customers?.last_name || ''}`.trim() || 'Anonyme'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getReviewType(review)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {review.comment}
                      </div>
                      {review.title && (
                        <div className="text-xs text-gray-500 mt-1">
                          &quot;{review.title}&quot;
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(review)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!review.is_approved ? (
                          <>
                            <button
                              onClick={() => handleApprove(review)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Approuver"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(review)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Rejeter"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400">Approuvé</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setSelectedReview(null);
          setActionType(null);
        }}
        onConfirm={confirmAction}
        title={actionType === 'approve' ? 'Approuver l&apos;avis' : 'Rejeter l&apos;avis'}
        message={
          actionType === 'approve'
            ? 'Êtes-vous sûr de vouloir approuver cet avis ? Il sera visible sur la page des avis.'
            : 'Êtes-vous sûr de vouloir rejeter cet avis ? Il ne sera pas visible sur la page des avis.'
        }
        confirmText={actionType === 'approve' ? 'Approuver' : 'Rejeter'}
        type={actionType === 'approve' ? 'info' : 'danger'}
      />
    </div>
  );
} 