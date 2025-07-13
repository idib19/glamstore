'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { failedEmailsApi } from '../../lib/supabase';
import { FailedEmail } from '../../types/database';

interface FailedEmailsStats {
  total: number;
  unresolved: number;
  byType: Array<{ email_type: string; count: number }>;
}

export default function FailedEmails() {
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([]);
  const [stats, setStats] = useState<FailedEmailsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [resolvingEmail, setResolvingEmail] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadFailedEmails = useCallback(async () => {
    try {
      setLoading(true);
      const emails = showResolved 
        ? await failedEmailsApi.getAll()
        : await failedEmailsApi.getUnresolved();
      setFailedEmails(emails);
    } catch (error) {
      console.error('Error loading failed emails:', error);
    } finally {
      setLoading(false);
    }
  }, [showResolved]);

  const loadStats = async () => {
    try {
      const statsData = await failedEmailsApi.getStatistics();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadFailedEmails();
    loadStats();
  }, [loadFailedEmails]);

  const handleMarkAsResolved = async (emailId: string) => {
    try {
      setResolvingEmail(emailId);
      await failedEmailsApi.markAsResolved(emailId, 'admin', resolutionNotes);
      setResolutionNotes('');
      setResolvingEmail(null);
      await loadFailedEmails();
      await loadStats();
    } catch (error) {
      console.error('Error marking email as resolved:', error);
      setResolvingEmail(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'appointment_confirmation': 'Confirmation RDV',
      'appointment_reminder': 'Rappel RDV',
      'appointment_cancellation': 'Annulation RDV',
      'order_confirmation': 'Confirmation Commande',
      'admin_appointment_notification': 'Notification Admin RDV',
      'admin_order_notification': 'Notification Admin Commande',
      'admin_appointment_reminder': 'Rappel Admin RDV',
      'admin_appointment_cancellation': 'Annulation Admin RDV'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (isResolved: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isResolved 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isResolved ? 'Résolu' : 'Non résolu'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Emails Échoués</h2>
            <p className="text-sm text-gray-600">
              Suivi des emails qui n&apos;ont pas pu être envoyés
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Afficher les résolus</span>
            </label>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
              <div className="text-sm text-gray-600">Non résolus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total - stats.unresolved}</div>
              <div className="text-sm text-gray-600">Résolus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.byType.length}</div>
              <div className="text-sm text-gray-600">Types d&apos;emails</div>
            </div>
          </div>
        </div>
      )}

      {/* Failed Emails List */}
      <div className="divide-y divide-gray-200">
        {failedEmails.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-lg">
              {showResolved ? 'Aucun email résolu trouvé' : 'Aucun email échoué non résolu'}
            </div>
          </div>
        ) : (
          failedEmails.map((email) => (
            <div key={email.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {getEmailTypeLabel(email.email_type)}
                    </span>
                    {getStatusBadge(email.is_resolved)}
                    {email.retry_count > 0 && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        {email.retry_count} tentative(s)
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Destinataire:</strong> {email.recipient_email}
                  </div>
                  
                  {email.subject && (
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Sujet:</strong> {email.subject}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Erreur:</strong> {email.error_message}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Créé le: {formatDate(email.created_at)}
                    {email.last_retry_at && (
                      <span className="ml-4">
                        Dernière tentative: {formatDate(email.last_retry_at)}
                      </span>
                    )}
                    {email.resolved_at && (
                      <span className="ml-4">
                        Résolu le: {formatDate(email.resolved_at)}
                        {email.resolved_by && ` par ${email.resolved_by}`}
                      </span>
                    )}
                  </div>
                  
                  {email.resolution_notes && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Notes de résolution:</strong> {email.resolution_notes}
                    </div>
                  )}
                </div>
                
                {!email.is_resolved && (
                  <div className="ml-4">
                    <button
                      onClick={() => setResolvingEmail(email.id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Marquer comme résolu
                    </button>
                  </div>
                )}
              </div>
              
              {/* Resolution Modal */}
              {resolvingEmail === email.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes de résolution (optionnel)
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Décrivez comment le problème a été résolu..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsResolved(email.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        setResolvingEmail(null);
                        setResolutionNotes('');
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 