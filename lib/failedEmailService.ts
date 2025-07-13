import { supabase } from './supabase';
import { FailedEmail } from '../types/database';

interface ErrorDetails {
  error?: unknown;
  stack?: string;
  emailData?: {
    to: string;
    subject: string;
    htmlLength: number;
    textLength: number;
  };
}

interface ContextData {
  customerName?: string;
  serviceName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentId?: string;
  customerId?: string;
  orderNumber?: string;
  orderTotal?: number;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  action?: string;
}

interface FailedEmailData {
  email_type: string;
  recipient_email: string;
  subject?: string;
  error_message: string;
  error_details?: ErrorDetails;
  context_data?: ContextData;
}

export const failedEmailService = {
  // Log a failed email attempt
  logFailedEmail: async (data: FailedEmailData): Promise<FailedEmail | null> => {
    try {
      console.log('📧 [failedEmailService] Logging failed email:', {
        type: data.email_type,
        recipient: data.recipient_email,
        error: data.error_message
      });

      const { data: failedEmail, error } = await supabase
        .from('failed_emails')
        .insert({
          email_type: data.email_type,
          recipient_email: data.recipient_email,
          subject: data.subject,
          error_message: data.error_message,
          error_details: data.error_details,
          context_data: data.context_data,
          retry_count: 0,
          is_resolved: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [failedEmailService] Error logging failed email:', error);
        return null;
      }

      console.log('✅ [failedEmailService] Failed email logged successfully:', failedEmail.id);
      return failedEmail;
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error logging failed email:', error);
      return null;
    }
  },

  // Get all failed emails (for admin dashboard)
  getAllFailedEmails: async (): Promise<FailedEmail[]> => {
    try {
      const { data, error } = await supabase
        .from('failed_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [failedEmailService] Error fetching failed emails:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error fetching failed emails:', error);
      return [];
    }
  },

  // Get unresolved failed emails
  getUnresolvedFailedEmails: async (): Promise<FailedEmail[]> => {
    try {
      const { data, error } = await supabase
        .from('failed_emails')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [failedEmailService] Error fetching unresolved failed emails:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error fetching unresolved failed emails:', error);
      return [];
    }
  },

  // Mark failed email as resolved
  markAsResolved: async (
    id: string, 
    resolvedBy: string, 
    resolutionNotes?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('failed_emails')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
          resolution_notes: resolutionNotes
        })
        .eq('id', id);

      if (error) {
        console.error('❌ [failedEmailService] Error marking failed email as resolved:', error);
        return false;
      }

      console.log('✅ [failedEmailService] Failed email marked as resolved:', id);
      return true;
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error marking failed email as resolved:', error);
      return false;
    }
  },

  // Increment retry count
  incrementRetryCount: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('failed_emails')
        .update({
          retry_count: supabase.rpc('increment_retry_count', { failed_email_id: id }),
          last_retry_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('❌ [failedEmailService] Error incrementing retry count:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error incrementing retry count:', error);
      return false;
    }
  },

  // Get failed emails by type
  getByEmailType: async (emailType: string): Promise<FailedEmail[]> => {
    try {
      const { data, error } = await supabase
        .from('failed_emails')
        .select('*')
        .eq('email_type', emailType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [failedEmailService] Error fetching failed emails by type:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error fetching failed emails by type:', error);
      return [];
    }
  },

  // Get failed emails by recipient
  getByRecipient: async (recipientEmail: string): Promise<FailedEmail[]> => {
    try {
      const { data, error } = await supabase
        .from('failed_emails')
        .select('*')
        .eq('recipient_email', recipientEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [failedEmailService] Error fetching failed emails by recipient:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error fetching failed emails by recipient:', error);
      return [];
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      // Get total failed emails
      const { count: totalCount, error: totalError } = await supabase
        .from('failed_emails')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('❌ [failedEmailService] Error getting total count:', totalError);
        return null;
      }

      // Get unresolved count
      const { count: unresolvedCount, error: unresolvedError } = await supabase
        .from('failed_emails')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false);

      if (unresolvedError) {
        console.error('❌ [failedEmailService] Error getting unresolved count:', unresolvedError);
        return null;
      }

      // Get count by email type (simplified approach)
      const { data: allFailedEmails, error: typeError } = await supabase
        .from('failed_emails')
        .select('email_type');

      if (typeError) {
        console.error('❌ [failedEmailService] Error getting type statistics:', typeError);
        return null;
      }

      // Count by type manually
      const typeCounts = (allFailedEmails || []).reduce((acc, email) => {
        acc[email.email_type] = (acc[email.email_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: totalCount || 0,
        unresolved: unresolvedCount || 0,
        byType: Object.entries(typeCounts).map(([type, count]) => ({ email_type: type, count }))
      };
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error getting statistics:', error);
      return null;
    }
  },

  // Clean up old resolved failed emails (older than specified days)
  cleanupOldResolvedEmails: async (daysOld: number = 30): Promise<boolean> => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('failed_emails')
        .delete()
        .eq('is_resolved', true)
        .lt('resolved_at', cutoffDate.toISOString());

      if (error) {
        console.error('❌ [failedEmailService] Error cleaning up old resolved emails:', error);
        return false;
      }

      console.log('✅ [failedEmailService] Old resolved emails cleaned up successfully');
      return true;
    } catch (error) {
      console.error('❌ [failedEmailService] Unexpected error cleaning up old resolved emails:', error);
      return false;
    }
  }
}; 