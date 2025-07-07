# Queen's Glam Setup Guide

This guide will help you set up the Queen's Glam beauty salon management system with Supabase.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service Role Key (for server-side operations)
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration (if using email features)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# App Configuration
NEXT_PUBLIC_APP_NAME="Queen's Glam"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Project Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Choose your region and database password

2. **Get Project Credentials**
   - Go to Settings → API
   - Copy the Project URL and anon public key
   - Add them to your `.env.local` file

3. **Install Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the entire contents of `supabase-schema.sql`
   - Paste and run the SQL script
   - Verify all tables, functions, and triggers are created

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 📋 Database Schema Overview

The database includes the following main components:

### Core Tables
- **Users**: Staff and admin accounts
- **Customers**: Customer profiles and information
- **Products**: Product catalog with inventory
- **Services**: Service offerings with pricing
- **Appointments**: Scheduling and booking system
- **Orders**: Sales and order management

### Key Features
- **Appointment Management**: Full scheduling system with availability checking
- **Inventory Tracking**: Automatic stock updates and low stock alerts
- **Customer Management**: Profiles, loyalty points, and history
- **Order Processing**: Complete order lifecycle management
- **Analytics**: Dashboard views for business insights

## 🔧 Database Functions

The schema includes several PostgreSQL functions:

- `check_appointment_availability()`: Verify appointment availability
- `calculate_appointment_end_time()`: Calculate appointment end times
- `get_customer_loyalty_points()`: Calculate customer loyalty points

## 📊 Dashboard Views

Pre-built views for common queries:

- `dashboard_overview`: Key business metrics
- `out_of_stock_products`: Products that are out of stock
- `todays_appointments`: Today's appointment schedule

## 🛡️ Security

Row Level Security (RLS) is enabled on all tables with appropriate policies:

- Staff can access customer data
- Public read access for active products/services
- Admin-only access for sensitive operations

## 🚀 Usage Examples

### Managing Products

```typescript
import { productsApi } from '@/lib/supabase'

// Create a new product
const product = await productsApi.create({
  name: 'Lip Gloss Ultra-hydratants',
  description: 'Lip gloss brillants et ultra-hydratants',
  price: 28.50,
  stock_quantity: 50,
  sku: 'QG-LG-001'
})

// Get out of stock products
const outOfStock = await productsApi.getOutOfStock()
```

### Managing Appointments

```typescript
import { appointmentsApi } from '@/lib/supabase'

// Check availability
const isAvailable = await appointmentsApi.checkAvailability(
  'staff-id',
  '2024-12-20',
  '14:00',
  60
)

// Create appointment
if (isAvailable) {
  const appointment = await appointmentsApi.create({
    customer_id: 'customer-id',
    service_id: 'service-id',
    appointment_date: '2024-12-20',
    start_time: '14:00',
    end_time: '15:00',
    total_price: 45.00
  })
}
```

### Managing Orders

```typescript
import { ordersApi } from '@/lib/supabase'

// Create order
const order = await ordersApi.create({
  customer_id: 'customer-id',
  subtotal: 95.50,
  total_amount: 95.50,
  status: 'confirmed'
})

// Add order items
await ordersApi.addItem({
  order_id: order.id,
  product_id: 'product-id',
  product_name: 'Lip Gloss',
  quantity: 2,
  unit_price: 28.50,
  total_price: 57.00
})
```

## 📈 Dashboard Integration

The database schema is designed to work seamlessly with the existing dashboard:

- **Overview Tab**: Uses `dashboard_overview` view
- **Products Tab**: Uses `products` table with categories
- **Services Tab**: Uses `services` table with categories
- **Orders Tab**: Uses `orders` table with items
- **Appointments Tab**: Uses `appointments` table with customer/service data

## 🔍 Monitoring

### Supabase Dashboard
- Monitor database performance
- View real-time logs
- Check authentication status
- Review API usage

### Common Queries

```sql
-- Check low stock products
SELECT * FROM out_of_stock_products;

-- View today's appointments
SELECT * FROM todays_appointments;

-- Get revenue by month
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total_amount) as revenue
FROM orders 
WHERE status = 'delivered'
GROUP BY month
ORDER BY month DESC;
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify Supabase URL and key in `.env.local`
   - Check if Supabase project is active

2. **Permission Errors**
   - Verify RLS policies are set correctly
   - Check user authentication status

3. **Type Errors**
   - Ensure `@supabase/supabase-js` is installed
   - Check TypeScript configuration

### Support

- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review the database schema in `supabase-schema.sql`
- Check the API documentation in `lib/supabase.ts`

## 🎯 Next Steps

1. **Customize the Schema**: Modify tables and fields as needed
2. **Add Authentication**: Implement user authentication with Supabase Auth
3. **Set up Storage**: Configure Supabase Storage for product images
4. **Add Real-time Features**: Enable real-time subscriptions for live updates
5. **Deploy**: Deploy your application with the database

The database schema provides a solid foundation for managing all aspects of your beauty salon business with modern development practices and full type safety. 