# Failed Email Tracking System - Queen's Glam

## Overview

The failed email tracking system has been implemented to monitor and manage email delivery failures in the Queen's Glam application. This system automatically logs failed email attempts to a database table and provides an admin interface to view, manage, and resolve email delivery issues.

## Features

### ✅ Database Tracking
- **Automatic Logging**: All failed email attempts are automatically logged to the `failed_emails` table
- **Detailed Error Information**: Captures error messages, stack traces, and context data
- **Retry Tracking**: Tracks retry attempts and last retry timestamps
- **Resolution Management**: Allows marking issues as resolved with notes

### ✅ Admin Dashboard
- **Failed Emails Tab**: New dashboard section for managing failed emails
- **Statistics Overview**: Shows total, unresolved, and resolved email counts
- **Filter Options**: Toggle between showing all emails or only unresolved ones
- **Resolution Interface**: Mark emails as resolved with optional notes
- **Detailed View**: Shows recipient, subject, error details, and timestamps

### ✅ Error Context
- **Email Type Tracking**: Categorizes failures by email type (appointment_confirmation, order_confirmation, etc.)
- **Context Data**: Stores relevant information about the failed email attempt
- **Customer Information**: Links failures to specific customers and orders/appointments

## Database Schema

### `failed_emails` Table

```sql
CREATE TABLE failed_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_type VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  error_message TEXT NOT NULL,
  error_details JSONB,
  context_data JSONB,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields:**
- `email_type`: Type of email that failed (e.g., 'appointment_confirmation')
- `recipient_email`: Email address of the intended recipient
- `error_message`: Human-readable error message
- `error_details`: JSON object with detailed error information
- `context_data`: JSON object with context about the email attempt
- `retry_count`: Number of retry attempts made
- `is_resolved`: Whether the issue has been resolved
- `resolution_notes`: Notes about how the issue was resolved

## Implementation Details

### 1. Email API Route (`app/api/email/route.ts`)

The email API route has been updated to automatically log failed emails:

```typescript
const sendEmail = async (emailData: EmailData, emailType: string, contextData?: any): Promise<boolean> => {
  try {
    // ... email sending logic ...
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log the failed email to database
    try {
      await failedEmailService.logFailedEmail({
        email_type: emailType,
        recipient_email: emailData.to,
        subject: emailData.subject,
        error_message: error instanceof Error ? error.message : 'Unknown email error',
        error_details: {
          error: error,
          stack: error instanceof Error ? error.stack : undefined,
          emailData: {
            to: emailData.to,
            subject: emailData.subject,
            htmlLength: emailData.html?.length || 0,
            textLength: emailData.text?.length || 0
          }
        },
        context_data: contextData
      });
    } catch (logError) {
      console.error('Error logging failed email to database:', logError);
      // Don't fail the main operation if logging fails
    }
    
    return false;
  }
};
```

### 2. Client-Side Error Handling

All email error handling in client components now logs to the database:

**Appointment Booking (`app/rendez-vous/page.tsx`):**
```typescript
} catch (emailError) {
  console.error('Error sending confirmation email or notification:', emailError);
  
  // Log the failed email attempt to database
  try {
    const { failedEmailService } = await import('../../lib/failedEmailService');
    await failedEmailService.logFailedEmail({
      email_type: 'appointment_confirmation',
      recipient_email: customerForm.email,
      subject: 'Confirmation de votre rendez-vous - Queen\'s Glam',
      error_message: emailError instanceof Error ? emailError.message : 'Unknown email error',
      error_details: {
        error: emailError,
        stack: emailError instanceof Error ? emailError.stack : undefined
      },
      context_data: {
        customerName: `${customerForm.first_name} ${customerForm.last_name}`,
        serviceName: selectedService.name,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        appointmentId: verifiedAppointment.id,
        customerId: customerId
      }
    });
  } catch (logError) {
    console.error('Error logging failed email to database:', logError);
  }
}
```

**Order Placement (`app/panier/page.tsx`):**
```typescript
} catch (emailError) {
  console.error('Error sending confirmation email or notification:', emailError);
  
  // Log the failed email attempt to database
  try {
    const { failedEmailService } = await import('../../lib/failedEmailService');
    await failedEmailService.logFailedEmail({
      email_type: 'order_confirmation',
      recipient_email: checkoutData.email,
      subject: 'Confirmation de votre commande - Queen\'s Glam',
      error_message: emailError instanceof Error ? emailError.message : 'Unknown email error',
      error_details: {
        error: emailError,
        stack: emailError instanceof Error ? emailError.stack : undefined
      },
      context_data: {
        customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
        orderNumber: verifiedOrder.order_number,
        orderTotal: verifiedOrder.total_amount,
        orderItems: state.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        customerId: verifiedOrder.customer_id
      }
    });
  } catch (logError) {
    console.error('Error logging failed email to database:', logError);
  }
}
```

### 3. Failed Email Service (`lib/failedEmailService.ts`)

A dedicated service for managing failed emails:

```typescript
export const failedEmailService = {
  // Log a failed email attempt
  logFailedEmail: async (data: FailedEmailData): Promise<FailedEmail | null>,
  
  // Get all failed emails (for admin dashboard)
  getAllFailedEmails: async (): Promise<FailedEmail[]>,
  
  // Get unresolved failed emails
  getUnresolvedFailedEmails: async (): Promise<FailedEmail[]>,
  
  // Mark failed email as resolved
  markAsResolved: async (id: string, resolvedBy: string, resolutionNotes?: string): Promise<boolean>,
  
  // Get statistics
  getStatistics: async (): Promise<FailedEmailsStats | null>,
  
  // Clean up old resolved failed emails
  cleanupOldResolvedEmails: async (daysOld: number = 30): Promise<boolean>
};
```

### 4. Dashboard Component (`components/dashboard/FailedEmails.tsx`)

A comprehensive admin interface for managing failed emails:

- **Statistics Overview**: Shows total, unresolved, and resolved counts
- **Email List**: Displays all failed emails with detailed information
- **Filter Options**: Toggle between showing all or only unresolved emails
- **Resolution Interface**: Mark emails as resolved with notes
- **Status Badges**: Visual indicators for resolved/unresolved status
- **Retry Count Display**: Shows number of retry attempts

## Email Types Tracked

The system tracks failures for all email types:

1. **appointment_confirmation** - Customer appointment confirmation emails
2. **appointment_reminder** - Customer appointment reminder emails
3. **appointment_cancellation** - Customer appointment cancellation emails
4. **order_confirmation** - Customer order confirmation emails
5. **admin_appointment_notification** - Admin appointment notifications
6. **admin_order_notification** - Admin order notifications
7. **admin_appointment_reminder** - Admin appointment reminder notifications
8. **admin_appointment_cancellation** - Admin appointment cancellation notifications

## Benefits

### ✅ **Proactive Monitoring**
- Immediate visibility into email delivery issues
- Ability to identify patterns in email failures
- Early detection of system-wide email problems

### ✅ **Customer Service**
- Track which customers didn't receive important emails
- Ability to manually resend emails when needed
- Maintain customer communication records

### ✅ **System Reliability**
- Non-blocking error logging (doesn't affect main operations)
- Detailed error context for debugging
- Resolution tracking for issue management

### ✅ **Admin Efficiency**
- Centralized view of all email issues
- Easy resolution management with notes
- Statistics for monitoring email system health

## Usage Instructions

### For Administrators

1. **Access Failed Emails**: Navigate to Dashboard → "Emails Échoués" tab
2. **View Statistics**: Check the overview statistics at the top
3. **Filter Emails**: Toggle "Afficher les résolus" to show/hide resolved emails
4. **Resolve Issues**: Click "Marquer comme résolu" on unresolved emails
5. **Add Notes**: Include resolution notes when marking emails as resolved

### For Developers

1. **Database Migration**: Run the `create-failed-emails-table.sql` migration
2. **Environment Setup**: Ensure the database connection is properly configured
3. **Testing**: Test email failures to verify logging works correctly
4. **Monitoring**: Check the failed emails dashboard regularly

## Future Enhancements

### Planned Features

1. **Automatic Retry System**
   - Implement automatic retry logic for failed emails
   - Configurable retry intervals and maximum attempts
   - Smart retry scheduling based on error types

2. **Email Templates Validation**
   - Validate email templates before sending
   - Check for common template issues
   - Prevent template-related failures

3. **Integration with Email Service**
   - Direct integration with Resend webhooks
   - Real-time delivery status updates
   - Bounce and spam report handling

4. **Advanced Analytics**
   - Email delivery success rates
   - Failure pattern analysis
   - Performance metrics and trends

5. **Automated Alerts**
   - Email notifications for critical failures
   - Dashboard alerts for high failure rates
   - Integration with monitoring systems

## Troubleshooting

### Common Issues

1. **Failed Email Not Logged**
   - Check database connection
   - Verify RLS policies are configured correctly
   - Check console for logging errors

2. **Dashboard Not Loading**
   - Ensure the FailedEmails component is imported
   - Check for TypeScript compilation errors
   - Verify API endpoints are accessible

3. **Permission Issues**
   - Ensure user has admin role
   - Check RLS policies for failed_emails table
   - Verify service role permissions

### Debug Mode

Enable detailed logging by checking browser console and server logs for:
- Email sending attempts
- Failed email logging operations
- Database connection issues
- RLS policy violations

## Files Modified

1. **Created**: `create-failed-emails-table.sql` - Database migration
2. **Created**: `lib/failedEmailService.ts` - Failed email service
3. **Created**: `components/dashboard/FailedEmails.tsx` - Dashboard component
4. **Updated**: `types/database.ts` - Added FailedEmail type
5. **Updated**: `lib/supabase.ts` - Added failedEmailsApi
6. **Updated**: `app/api/email/route.ts` - Enhanced error logging
7. **Updated**: `app/rendez-vous/page.tsx` - Added error logging
8. **Updated**: `app/panier/page.tsx` - Added error logging
9. **Updated**: `components/EditAppointmentModal.tsx` - Added error logging
10. **Updated**: `app/dashboard/page.tsx` - Added FailedEmails tab
11. **Created**: `FAILED_EMAIL_TRACKING_SYSTEM.md` - This documentation

## Next Steps

1. **Run Database Migration**: Execute the SQL migration in your Supabase database
2. **Test Email Failures**: Intentionally cause email failures to test logging
3. **Monitor Dashboard**: Check the failed emails dashboard regularly
4. **Set Up Alerts**: Configure monitoring for high failure rates
5. **Document Procedures**: Create procedures for handling failed emails 