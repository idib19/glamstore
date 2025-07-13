'use client';

import { useState } from 'react';
import { emailService } from '../lib/emailService';

export default function EmailAPITestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAppointmentEmail = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const emailResult = await emailService.sendAppointmentConfirmation({
        customerName: 'Test Customer',
        customerEmail: 'idib2025@gmail.com',
        serviceName: 'Manucure & Pédicure',
        appointmentDate: '2024-12-25',
        appointmentTime: '14:00',
        duration: 60,
        price: 45.00,
        appointmentId: 'test-appointment-123'
      });

      setResult(`✅ Appointment confirmation test completed!\nEmail sent: ${emailResult}\nNote: Admin notification is automatically sent with this email type.`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAppointmentReminder = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const emailResult = await emailService.sendAppointmentReminder({
        customerName: 'Test Customer',
        customerEmail: 'idib2025@gmail.com',
        serviceName: 'Manucure & Pédicure',
        appointmentDate: '2024-12-25',
        appointmentTime: '14:00',
        duration: 60,
        price: 45.00,
        appointmentId: 'test-appointment-123'
      });

      setResult(`✅ Appointment reminder test completed!\nEmail sent: ${emailResult}\nNote: Admin notification is automatically sent with this email type.`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAppointmentCancellation = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const emailResult = await emailService.sendAppointmentCancellation({
        customerName: 'Test Customer',
        customerEmail: 'idib2025@gmail.com',
        serviceName: 'Manucure & Pédicure',
        appointmentDate: '2024-12-25',
        appointmentTime: '14:00',
        duration: 60,
        price: 45.00,
        appointmentId: 'test-appointment-123'
      });

      setResult(`✅ Appointment cancellation test completed!\nEmail sent: ${emailResult}\nNote: Admin notification is automatically sent with this email type.`);
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
        customerEmail: 'idib2025@gmail.com',
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

      setResult(`✅ Order confirmation test completed!\nEmail sent: ${emailResult}\nNote: Admin notification is automatically sent with this email type.`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Server-Side Email API Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testAppointmentEmail}
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Appointment Confirmation'}
        </button>

        <button
          onClick={testAppointmentReminder}
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Appointment Reminder'}
        </button>

        <button
          onClick={testAppointmentCancellation}
          disabled={isLoading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Appointment Cancellation'}
        </button>

        <button
          onClick={testOrderEmail}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Order Confirmation'}
        </button>

        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>✅ This component uses the secure server-side API route.</p>
        <p>✅ API keys are now protected on the server.</p>
        <p>Make sure RESEND_API_KEY and FROM_EMAIL are configured in your environment.</p>
      </div>
    </div>
  );
} 