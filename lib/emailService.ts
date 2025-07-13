// Client-side email service that calls the server-side API
// This ensures API keys are kept secure on the server

interface AppointmentEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  appointmentId: string;
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: string;
}

interface AdminOrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: string;
  orderDate: string;
}

interface AdminAppointmentNotificationData {
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
}

type EmailData = AppointmentEmailData | OrderEmailData | AdminOrderNotificationData | AdminAppointmentNotificationData;

// Send email via API route
const sendEmailViaAPI = async (type: string, data: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email API error:', errorData);
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error calling email API:', error);
    return false;
  }
};

export const emailService = {
  // Send appointment confirmation email (also sends to admin)
  sendAppointmentConfirmation: async (data: AppointmentEmailData) => {
    return await sendEmailViaAPI('appointment_confirmation', data);
  },

  // Send appointment reminder email (also sends to admin)
  sendAppointmentReminder: async (data: AppointmentEmailData) => {
    return await sendEmailViaAPI('appointment_reminder', data);
  },

  // Send appointment cancellation email (also sends to admin)
  sendAppointmentCancellation: async (data: AppointmentEmailData) => {
    return await sendEmailViaAPI('appointment_cancellation', data);
  },

  // Send order confirmation email (also sends to admin)
  sendOrderConfirmation: async (data: OrderEmailData) => {
    return await sendEmailViaAPI('order_confirmation', data);
  },

  // Legacy admin-only notifications (for backward compatibility)
  sendAdminOrderNotification: async (data: AdminOrderNotificationData) => {
    return await sendEmailViaAPI('admin_order_notification', data);
  },

  sendAdminAppointmentNotification: async (data: AdminAppointmentNotificationData) => {
    return await sendEmailViaAPI('admin_appointment_notification', data);
  }
}; 