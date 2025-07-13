# Email Notification System - Queen's Glam

## Overview

The email notification system for Queen's Glam has been implemented using **Resend** as the email delivery service. This system provides professional, branded email templates for appointment and order confirmations, with fallback support for plain text emails.

## Features

### ✅ Implemented Email Types

1. **Appointment Confirmation Email**
   - Sent when a customer books an appointment
   - Includes complete appointment details
   - Professional HTML template with Queen's Glam branding
   - Plain text fallback

2. **Order Confirmation Email**
   - Sent when a customer completes an order
   - Includes order details, items, and totals
   - Professional HTML template with order summary
   - Plain text fallback

3. **Admin Appointment Notification**
   - Sent to admin when a new appointment is booked
   - Includes customer information and appointment details
   - Professional admin-focused template
   - Plain text fallback

4. **Admin Order Notification**
   - Sent to admin when a new order is placed
   - Includes customer information and complete order details
   - Professional admin-focused template
   - Plain text fallback

5. **Appointment Reminder Email**
   - Template ready for reminder functionality
   - Gentle reminder format
   - Professional styling

6. **Appointment Cancellation Email**
   - Template ready for cancellation notifications
   - Clear cancellation messaging
   - Professional handling

### ✅ Database Integration

- **Notifications Table**: Stores all notification records
- **New Notification Types**: Added `appointment_confirmation` and `order_confirmation`
- **Notification Service**: Handles database operations for notifications
- **Customer Tracking**: Links notifications to customer accounts

## Technical Implementation

### Email Service (`lib/emailService.ts`)

The email service uses Resend for reliable email delivery:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

**Key Features:**
- Professional HTML templates with responsive design
- Plain text fallbacks for email clients that don't support HTML
- Error handling and logging
- Graceful fallback when API key is not configured
- Configurable sender email via environment variables

### Notification Service (`lib/notificationService.ts`)

Handles database operations for notifications:

```typescript
// Create notification in database
await notificationService.createAppointmentConfirmationNotification({
  customer_id: customerId,
  customer_name: customerName,
  service_name: serviceName,
  appointment_date: appointmentDate,
  appointment_time: appointmentTime,
  appointment_id: appointmentId,
  price: price
});
```

**Key Features:**
- Database notification creation
- Notification retrieval and management
- Mark as read functionality
- Unread count tracking
- Cleanup functions for old notifications

## Email Templates

### Appointment Confirmation Template

**Features:**
- Professional gradient header with Queen's Glam branding
- Complete appointment details in organized layout
- Contact information section
- Call-to-action button
- Responsive design for mobile devices
- French localization

**Template Elements:**
- Service name and details
- Date and time (formatted in French)
- Duration and price
- Appointment ID for reference
- Contact information
- CTA to view appointments

### Order Confirmation Template

**Features:**
- Professional order summary table
- Complete itemized list of products
- Total calculation display
- Shipping address information
- Call-to-action button
- Responsive design

**Template Elements:**
- Order number and date
- Product table with quantities and prices
- Order total
- Shipping address
- CTA to track order

### Admin Order Notification Template

**Features:**
- Admin-focused design with green color scheme
- Complete customer information
- Detailed order breakdown
- Shipping address
- Professional admin styling

**Template Elements:**
- Customer name, email, and phone
- Order number and date
- Complete product table
- Order total
- Shipping address
- Admin action prompts

### Admin Appointment Notification Template

**Features:**
- Admin-focused design with blue color scheme
- Complete customer information
- Detailed appointment details
- Professional admin styling

**Template Elements:**
- Customer name, email, and phone
- Service details
- Appointment date and time
- Duration and price
- Appointment ID
- Admin action prompts

## Setup Instructions

### 1. Environment Configuration

Add the following to your `.env.local` file:

```env
# Email Configuration - Resend
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@queensglam.com

# Admin Email for Notifications
ADMIN_EMAIL=admin@queensglam.com
```

### 2. Resend Account Setup

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your email address

2. **Get API Key**
   - Navigate to API Keys in your dashboard
   - Create a new API key
   - Copy the key to your environment variables

3. **Configure Sender Email**
   - Set `FROM_EMAIL` in your environment variables
   - Use a verified domain for production
   - For development, you can use the default sender

4. **Domain Verification (Optional)**
   - For production, verify your domain
   - This allows sending from custom domains
   - For development, you can use the default sender

### 3. Database Migration

Run the notification types update:

```sql
-- Execute the update-notification-types.sql file
-- This adds the new notification types to the database
```

### 4. Testing

Test the email system:

1. **Appointment Booking**
   - Book a test appointment
   - Check email delivery
   - Verify notification creation

2. **Order Placement**
   - Complete a test order
   - Check email delivery
   - Verify notification creation

## Email Template Design

### Design Principles

1. **Brand Consistency**
   - Queen's Glam color scheme (pink gradients)
   - Professional typography
   - Consistent spacing and layout

2. **Mobile Responsiveness**
   - Responsive design for all screen sizes
   - Optimized for mobile email clients
   - Touch-friendly buttons

3. **Accessibility**
   - High contrast colors
   - Clear typography
   - Alt text for images
   - Plain text fallbacks

4. **Professional Appearance**
   - Clean, modern design
   - Proper spacing and alignment
   - Professional color scheme
   - Branded elements

### Template Structure

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- Meta tags and responsive viewport -->
  <!-- Inline CSS for email compatibility -->
</head>
<body>
  <div class="container">
    <!-- Header with branding -->
    <div class="header">
      <!-- Logo and title -->
    </div>
    
    <!-- Main content -->
    <div class="content">
      <!-- Greeting and message -->
      <!-- Details section -->
      <!-- Call-to-action -->
      <!-- Footer message -->
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <!-- Company info and disclaimers -->
    </div>
  </div>
</body>
</html>
```

## Integration Points

### Appointment Booking Flow

```typescript
// In app/rendez-vous/page.tsx
await Promise.all([
  emailService.sendAppointmentConfirmation({
    customerName: `${customerForm.first_name} ${customerForm.last_name}`,
    customerEmail: customerForm.email,
    serviceName: selectedService.name,
    appointmentDate: selectedDate,
    appointmentTime: selectedTime,
    duration: selectedService.duration_minutes,
    price: selectedService.price,
    appointmentId: newAppointment.id
  }),
  emailService.sendAdminAppointmentNotification({
    appointmentId: newAppointment.id,
    customerName: `${customerForm.first_name} ${customerForm.last_name}`,
    customerEmail: customerForm.email,
    customerPhone: customerForm.phone,
    serviceName: selectedService.name,
    appointmentDate: selectedDate,
    appointmentTime: selectedTime,
    duration: selectedService.duration_minutes,
    price: selectedService.price
  }),
  notificationService.createAppointmentConfirmationNotification({
    customer_id: customerId,
    customer_name: `${customerForm.first_name} ${customerForm.last_name}`,
    service_name: selectedService.name,
    appointment_date: selectedDate,
    appointment_time: selectedTime,
    appointment_id: newAppointment.id,
    price: selectedService.price
  })
]);
```

### Order Confirmation Flow

```typescript
// In app/panier/page.tsx
await Promise.all([
  emailService.sendOrderConfirmation({
    customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
    customerEmail: checkoutData.email,
    orderNumber: order.order_number,
    orderTotal: order.total_amount,
    orderItems: state.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    })),
    shippingAddress: `${checkoutData.address}, ${checkoutData.postalCode} ${checkoutData.city}, ${checkoutData.country}`
  }),
  emailService.sendAdminOrderNotification({
    orderNumber: order.order_number,
    customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
    customerEmail: checkoutData.email,
    customerPhone: checkoutData.phone,
    orderTotal: order.total_amount,
    orderItems: state.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    })),
    shippingAddress: `${checkoutData.address}, ${checkoutData.postalCode} ${checkoutData.city}, ${checkoutData.country}`,
    orderDate: new Date().toLocaleDateString('fr-FR')
  }),
  notificationService.createOrderConfirmationNotification({
    customer_id: order.customer_id || '',
    customer_name: `${checkoutData.firstName} ${checkoutData.lastName}`,
    order_number: order.order_number,
    order_total: order.total_amount,
    order_items: state.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    }))
  })
]);
```

## Error Handling

### Email Service Errors

```typescript
try {
  await emailService.sendAppointmentConfirmation(data);
} catch (error) {
  console.error('Error sending email:', error);
  // Don't fail the main operation if email fails
  // Log error for monitoring
}
```

### Notification Service Errors

```typescript
try {
  await notificationService.createAppointmentConfirmationNotification(data);
} catch (error) {
  console.error('Error creating notification:', error);
  // Don't fail the main operation if notification fails
  // Log error for monitoring
}
```

## Monitoring and Analytics

### Email Delivery Tracking

Resend provides delivery tracking:
- Delivery status
- Open rates
- Click rates
- Bounce rates
- Spam reports

### Database Monitoring

Track notification metrics:
- Notification creation rates
- Read rates
- Customer engagement
- System performance

## Future Enhancements

### Planned Features

1. **SMS Notifications**
   - Integrate with SMS service
   - Send appointment reminders via SMS
   - Order status updates

2. **Advanced Email Templates**
   - Dynamic content based on customer preferences
   - Personalized recommendations
   - Seasonal promotions

3. **Email Automation**
   - Automated reminder sequences
   - Follow-up emails
   - Re-engagement campaigns

4. **Analytics Dashboard**
   - Email performance metrics
   - Customer engagement tracking
   - A/B testing capabilities

### Technical Improvements

1. **Template Engine**
   - Use a template engine like Handlebars
   - Dynamic template generation
   - Template versioning

2. **Queue System**
   - Implement email queuing
   - Retry mechanisms
   - Rate limiting

3. **Webhook Integration**
   - Real-time delivery status
   - Bounce handling
   - Spam report processing

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check RESEND_API_KEY environment variable
   - Verify Resend account status
   - Check email address format

2. **Template Rendering Issues**
   - Test in different email clients
   - Check CSS compatibility
   - Verify HTML structure

3. **Database Errors**
   - Check notification table structure
   - Verify customer_id references
   - Check database permissions

### Debug Mode

Enable debug logging:

```typescript
// Add to emailService.ts for debugging
console.log('Email data:', {
  to: emailData.to,
  subject: emailData.subject,
  html: emailData.html.substring(0, 200) + '...'
});
```

## Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Email Validation**
   - Validate email addresses before sending
   - Implement rate limiting
   - Monitor for abuse

3. **Data Privacy**
   - Comply with GDPR requirements
   - Include unsubscribe options
   - Secure customer data handling

## Conclusion

The email notification system provides a robust, professional solution for customer communications. With Resend's reliable delivery and professional templates, Queen's Glam can maintain excellent customer communication while building brand awareness and trust.

The system is designed to be scalable, maintainable, and easily extensible for future requirements. 