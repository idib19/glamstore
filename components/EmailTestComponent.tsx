'use client';

import { useState } from 'react';
import { emailService } from '../lib/emailService';
import { notificationService } from '../lib/notificationService';

export default function EmailTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAppointmentEmail = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const emailResult = await emailService.sendAppointmentConfirmation({
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        serviceName: 'Manucure & Pédicure',
        appointmentDate: '2024-12-25',
        appointmentTime: '14:00',
        duration: 60,
        price: 45.00,
        appointmentId: 'test-appointment-123'
      });

      const adminResult = await emailService.sendAdminAppointmentNotification({
        appointmentId: 'test-appointment-123',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+33 1 23 45 67 89',
        serviceName: 'Manucure & Pédicure',
        appointmentDate: '2024-12-25',
        appointmentTime: '14:00',
        duration: 60,
        price: 45.00
      });

      const notificationResult = await notificationService.createAppointmentConfirmationNotification({
        customer_id: 'test-customer-id',
        customer_name: 'Test Customer',
        service_name: 'Manucure & Pédicure',
        appointment_date: '2024-12-25',
        appointment_time: '14:00',
        appointment_id: 'test-appointment-123',
        price: 45.00
      });

      setResult(`✅ Appointment email test completed!\nCustomer email sent: ${emailResult}\nAdmin notification sent: ${adminResult}\nDatabase notification created: ${notificationResult ? 'Yes' : 'No'}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testOrderEmail = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const emailResult = await emailService.sendOrderConfirmation({
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        orderNumber: 'QG-2024-12-0001',
        orderTotal: 89.97,
        orderItems: [
          {
            name: 'Lip Gloss Ultra Hydratant',
            quantity: 2,
            price: 12.99,
            total: 25.98
          },
          {
            name: 'Masque à Lèvres',
            quantity: 1,
            price: 12.99,
            total: 12.99
          }
        ],
        shippingAddress: '123 Test Street, 75001 Paris, France'
      });

      const adminResult = await emailService.sendAdminOrderNotification({
        orderNumber: 'QG-2024-12-0001',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+33 1 23 45 67 89',
        orderTotal: 89.97,
        orderItems: [
          {
            name: 'Lip Gloss Ultra Hydratant',
            quantity: 2,
            price: 12.99,
            total: 25.98
          },
          {
            name: 'Masque à Lèvres',
            quantity: 1,
            price: 12.99,
            total: 12.99
          }
        ],
        shippingAddress: '123 Test Street, 75001 Paris, France',
        orderDate: new Date().toLocaleDateString('fr-FR')
      });

      const notificationResult = await notificationService.createOrderConfirmationNotification({
        customer_id: 'test-customer-id',
        customer_name: 'Test Customer',
        order_number: 'QG-2024-12-0001',
        order_total: 89.97,
        order_items: [
          {
            name: 'Lip Gloss Ultra Hydratant',
            quantity: 2,
            price: 12.99,
            total: 25.98
          },
          {
            name: 'Masque à Lèvres',
            quantity: 1,
            price: 12.99,
            total: 12.99
          }
        ]
      });

      setResult(`✅ Order email test completed!\nCustomer email sent: ${emailResult}\nAdmin notification sent: ${adminResult}\nDatabase notification created: ${notificationResult ? 'Yes' : 'No'}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Email System Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testAppointmentEmail}
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Appointment Email'}
        </button>

        <button
          onClick={testOrderEmail}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Order Email'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This component is for development testing only.</p>
        <p>Make sure RESEND_API_KEY and FROM_EMAIL are configured in your environment.</p>
      </div>
    </div>
  );
} 