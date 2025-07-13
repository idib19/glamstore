import { supabase } from './supabase';
import { NotificationType } from '../types/database';

interface NotificationData {
  customer_id: string;
  type: typeof NotificationType[keyof typeof NotificationType];
  title: string;
  message: string;
}

interface AppointmentNotificationData {
  customer_id: string;
  customer_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_id: string;
  price: number;
}

interface OrderNotificationData {
  customer_id: string;
  customer_name: string;
  order_number: string;
  order_total: number;
  order_items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export const notificationService = {
  // Create a notification in the database
  createNotification: async (data: NotificationData) => {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          customer_id: data.customer_id,
          type: data.type,
          title: data.title,
          message: data.message,
          is_read: false,
          sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  // Create appointment confirmation notification
  createAppointmentConfirmationNotification: async (data: AppointmentNotificationData) => {
    const notificationData: NotificationData = {
      customer_id: data.customer_id,
      type: 'appointment_confirmation',
      title: 'Rendez-vous confirmé - Queen\'s Glam',
      message: `Votre rendez-vous pour ${data.service_name} le ${new Date(data.appointment_date).toLocaleDateString('fr-FR')} à ${data.appointment_time} a été confirmé. Numéro de RDV: #${data.appointment_id.slice(0, 8)}`
    };

    return await notificationService.createNotification(notificationData);
  },

  // Create order confirmation notification
  createOrderConfirmationNotification: async (data: OrderNotificationData) => {
    const notificationData: NotificationData = {
      customer_id: data.customer_id,
      type: 'order_confirmation',
      title: 'Commande confirmée - Queen\'s Glam',
      message: `Votre commande #${data.order_number} d'un montant de ${data.order_total.toFixed(2)} € a été confirmée et sera traitée dans les plus brefs délais.`
    };

    return await notificationService.createNotification(notificationData);
  },

  // Create appointment reminder notification
  createAppointmentReminderNotification: async (data: AppointmentNotificationData) => {
    const notificationData: NotificationData = {
      customer_id: data.customer_id,
      type: 'appointment_reminder',
      title: 'Rappel de rendez-vous - Queen\'s Glam',
      message: `Rappel : Votre rendez-vous pour ${data.service_name} est prévu demain le ${new Date(data.appointment_date).toLocaleDateString('fr-FR')} à ${data.appointment_time}.`
    };

    return await notificationService.createNotification(notificationData);
  },

  // Get notifications for a customer
  getCustomerNotifications: async (customerId: string, limit: number = 10) => {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('customer_id', customerId)
        .order('sent_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Mark all notifications as read for a customer
  markAllAsRead: async (customerId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('customer_id', customerId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Get unread notification count for a customer
  getUnreadCount: async (customerId: string) => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', customerId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Delete old notifications (cleanup function)
  deleteOldNotifications: async (daysOld: number = 90) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('sent_at', cutoffDate.toISOString());

      if (error) {
        console.error('Error deleting old notifications:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      return false;
    }
  }
}; 