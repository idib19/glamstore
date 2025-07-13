# Server-Side Email Implementation

## Overview

We've successfully migrated the email notification system from client-side to server-side API routes to ensure security and proper handling of sensitive API keys.

## What Was Changed

### 1. Server-Side API Route (`app/api/email/route.ts`)

- **Created**: New API route at `/api/email` that handles all email sending operations
- **Security**: API keys are now kept secure on the server side
- **Email Types Supported**:
  - `appointment_confirmation` - Customer appointment confirmation
  - `order_confirmation` - Customer order confirmation  
  - `admin_appointment_notification` - Admin notification for new appointments
  - `admin_order_notification` - Admin notification for new orders

### 2. Updated Client-Side Service (`lib/emailService.ts`)

- **Simplified**: Removed all direct Resend client code
- **API Calls**: Now makes HTTP requests to the server-side API route
- **Same Interface**: All existing function calls remain the same
- **Error Handling**: Proper error handling for API failures

### 3. Environment Variables

- **Changed**: `NEXT_PUBLIC_RESEND_API_KEY` → `RESEND_API_KEY`
- **Security**: API key is no longer exposed to the client
- **Server Only**: Environment variable is only accessible on the server

## Email Notification Types

### Appointment Emails (All automatically send to admin as well)
1. **Customer Confirmation** (`sendAppointmentConfirmation`)
   - Sent to customer when appointment is booked
   - **Automatically sends admin notification**
   - Includes service details, date, time, duration, price

2. **Customer Reminder** (`sendAppointmentReminder`)
   - Sent to customer as appointment reminder
   - **Automatically sends admin notification**
   - Includes service details, date, time, duration, price

3. **Customer Cancellation** (`sendAppointmentCancellation`)
   - Sent to customer when appointment is cancelled
   - **Automatically sends admin notification**
   - Includes service details, date, time, duration, price

### Order Emails (All automatically send to admin as well)
1. **Customer Confirmation** (`sendOrderConfirmation`)
   - Sent to customer when order is placed
   - **Automatically sends admin notification**
   - Includes order number, total, shipping address

### Legacy Admin-Only Notifications (for backward compatibility)
- `sendAdminAppointmentNotification` - Admin-only appointment notification
- `sendAdminOrderNotification` - Admin-only order notification

## API Usage

### Client-Side (No Changes Required)
```typescript
import { emailService } from '../lib/emailService';

// Send appointment confirmation (automatically sends to admin too)
await emailService.sendAppointmentConfirmation({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  serviceName: 'Manicure',
  appointmentDate: '2024-12-25',
  appointmentTime: '14:00',
  duration: 60,
  price: 45.00,
  appointmentId: 'app-123'
});

// Send appointment reminder (automatically sends to admin too)
await emailService.sendAppointmentReminder({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  serviceName: 'Manicure',
  appointmentDate: '2024-12-25',
  appointmentTime: '14:00',
  duration: 60,
  price: 45.00,
  appointmentId: 'app-123'
});

// Send appointment cancellation (automatically sends to admin too)
await emailService.sendAppointmentCancellation({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  serviceName: 'Manicure',
  appointmentDate: '2024-12-25',
  appointmentTime: '14:00',
  duration: 60,
  price: 45.00,
  appointmentId: 'app-123'
});

// Send order confirmation (automatically sends to admin too)
await emailService.sendOrderConfirmation({
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  orderNumber: 'QG-2024-12-0001',
  orderTotal: 89.97,
  orderItems: [...],
  shippingAddress: '123 Main St, City, Country'
});
```

### Server-Side API Endpoint
```typescript
POST /api/email
Content-Type: application/json

{
  "type": "appointment_confirmation",
  "data": {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    // ... other data
  }
}
```

## Environment Setup

### Required Environment Variables
```bash
# Email Configuration (Server-side only)
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=noreply@queensglam.com
ADMIN_EMAIL=admin@queensglam.com
```

### Important Notes
- `RESEND_API_KEY` must be set (not `NEXT_PUBLIC_RESEND_API_KEY`)
- `FROM_EMAIL` should be a verified domain in your Resend account
- `ADMIN_EMAIL` is used for admin notifications

## Testing

### Test Component
Created `components/EmailAPITestComponent.tsx` for testing the new server-side implementation.

### Testing Steps
1. Update your `.env` file with the correct environment variables
2. Restart your development server
3. Use the test component to verify email sending works
4. Check server logs for any errors

## Benefits

### Security
- ✅ API keys are no longer exposed to the client
- ✅ All sensitive operations happen on the server
- ✅ Environment variables are properly protected

### Reliability
- ✅ Better error handling and logging
- ✅ Centralized email sending logic
- ✅ Easier to monitor and debug

### Maintainability
- ✅ Clean separation of concerns
- ✅ Easier to add new email types
- ✅ Consistent email templates

### Admin Notifications
- ✅ **All customer emails automatically send admin notifications**
- ✅ Admin is always informed of appointments, reminders, cancellations, and orders
- ✅ No need to manually call separate admin notification functions
- ✅ Consistent admin notification format across all email types

## Files Modified

1. **Created**: `app/api/email/route.ts` - Server-side API route
2. **Updated**: `lib/emailService.ts` - Client-side service
3. **Updated**: `env-template.txt` - Environment template
4. **Created**: `components/EmailAPITestComponent.tsx` - Test component
5. **Created**: `SERVER_SIDE_EMAIL_IMPLEMENTATION.md` - This documentation

## Next Steps

1. Update your `.env` file with the correct environment variables
2. Test the email functionality using the test component
3. Verify that existing appointment and order flows still work
4. Monitor server logs for any email-related errors

## Troubleshooting

### Common Issues

1. **"Missing API key" error**
   - Ensure `RESEND_API_KEY` is set in your `.env` file
   - Restart your development server after changing environment variables

2. **"ADMIN_EMAIL not configured" warning**
   - Set `ADMIN_EMAIL` in your `.env` file for admin notifications

3. **Email not sending**
   - Check server logs for detailed error messages
   - Verify your Resend API key is valid
   - Ensure your `FROM_EMAIL` domain is verified in Resend

4. **CORS errors**
   - API routes are server-side only, so CORS shouldn't be an issue
   - If you see CORS errors, check that you're calling the correct endpoint

### Debug Mode
The API route includes detailed logging. Check your server console for:
- Email sending attempts
- Success/failure messages
- Detailed error information 