# Queen&apos;s Glam Database Schema

This document describes the comprehensive Supabase database schema for the Queen&apos;s Glam beauty salon management system.

## 🏗️ Database Overview

The database is designed to handle all aspects of a beauty salon business including:

- **Appointment Management**: Scheduling, availability, status tracking
- **Product Management**: Inventory, pricing, categories, images
- **Service Management**: Services, pricing, duration, categories
- **Order Management**: Sales, order items, payment tracking
- **Customer Management**: Profiles, loyalty points, history
- **Staff Management**: Users, availability, time off
- **Analytics**: Sales tracking, reporting, insights

## 📋 Table Structure

### Core Tables

#### Users
- **Purpose**: Staff and admin user accounts
- **Key Fields**: `id`, `email`, `role`, `is_active`
- **Roles**: `admin`, `staff`, `manager`

#### Customers
- **Purpose**: Customer profiles and information
- **Key Fields**: `id`, `first_name`, `last_name`, `email`, `phone`, `loyalty_points`, `total_spent`

### Product Management

#### Product Categories
- **Purpose**: Organize products by category
- **Key Fields**: `id`, `name`, `slug`, `is_active`

#### Products
- **Purpose**: Product catalog with simple stock tracking
- **Key Fields**: `id`, `name`, `price`, `in_stock`, `sku`, `is_active`
- **Features**: 
  - Price management (regular, sale, cost prices)
  - Simple in-stock/out-of-stock boolean tracking
  - Product images support
  - Soft delete functionality

#### Product Images
- **Purpose**: Multiple images per product
- **Key Fields**: `product_id`, `image_url`, `is_primary`, `sort_order`

### Service Management

#### Service Categories
- **Purpose**: Organize services by category
- **Key Fields**: `id`, `name`, `slug`, `is_active`

#### Services
- **Purpose**: Service catalog with pricing and duration
- **Key Fields**: `id`, `name`, `price`, `duration_minutes`, `is_active`

### Appointment Management

#### Appointments
- **Purpose**: Appointment scheduling and management
- **Key Fields**: `customer_id`, `service_id`, `appointment_date`, `start_time`, `end_time`, `status`
- **Status Options**: `scheduled`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`
- **Features**:
  - Deposit tracking
  - Reminder system
  - Multiple services per appointment

#### Appointment Services
- **Purpose**: Link multiple services to a single appointment
- **Key Fields**: `appointment_id`, `service_id`, `price`

### Order Management

#### Orders
- **Purpose**: Sales order tracking
- **Key Fields**: `order_number`, `customer_id`, `status`, `total_amount`, `payment_status`
- **Status Options**: `pending`, `waiting_for_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`
- **Features**:
  - Automatic order number generation
  - Guest order support
  - Tax and shipping calculation
  - Discount support

#### Order Items
- **Purpose**: Individual items within orders
- **Key Fields**: `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`

### Customer Engagement

#### Reviews
- **Purpose**: Customer feedback and ratings
- **Key Fields**: `customer_id`, `rating`, `comment`, `is_approved`
- **Features**: Support for product, service, and appointment reviews

#### Loyalty Transactions
- **Purpose**: Track customer loyalty points
- **Transaction Types**: `earned`, `redeemed`, `expired`, `adjusted`

#### Promotions
- **Purpose**: Discount codes and promotions
- **Key Fields**: `code`, `discount_type`, `discount_value`, `usage_limit`
- **Discount Types**: `percentage`, `fixed_amount`

#### Notifications
- **Purpose**: Customer communication system
- **Types**: `appointment_reminder`, `appointment_details_update`, `order_update`, `promotion`, `birthday`, `system`

### Analytics

#### Sales Analytics
- **Purpose**: Daily sales and business metrics
- **Key Fields**: `date`, `total_sales`, `total_orders`, `total_appointments`, `average_order_value`

## 🔧 Database Functions

### Appointment Management
- `check_appointment_availability()`: Verify if a time slot is available
- `calculate_appointment_end_time()`: Calculate end time based on duration

### Customer Management
- `get_customer_loyalty_points()`: Calculate current loyalty points

## 📊 Database Views

### Dashboard Views
- `dashboard_overview`: Key metrics for dashboard
- `out_of_stock_products`: Products that are out of stock
- `todays_appointments`: Today's appointment schedule

## 🔄 Triggers



### Order Number Generation
- Automatically generates unique order numbers in format: `QG-YYYY-MM-XXXX`

### Customer Total Spent
- Updates customer total spent when orders are delivered

## 🛡️ Security

### Row Level Security (RLS)
- Enabled on all tables
- Policies for staff access to customer data
- Public read access for active products and services
- Admin-only access for sensitive operations

## 📦 Setup Instructions

### 1. Supabase Project Setup

1. Create a new Supabase project
2. Copy your project URL and anon key
3. Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Schema Installation

1. Run the SQL schema file in your Supabase SQL editor:
```sql
-- Copy and paste the contents of supabase-schema.sql
```

2. Verify all tables, functions, and triggers are created

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. TypeScript Setup

The `types/database.ts` file provides full TypeScript support for all database operations.

## 🚀 Usage Examples

### Creating a New Product

```typescript
import { productsApi } from '@/lib/supabase'

const newProduct = await productsApi.create({
  name: 'Lip Gloss Ultra-hydratants',
  description: 'Lip gloss brillants et ultra-hydratants signés Queen&apos;s Glam',
  category_id: 'category-uuid',
  price: 28.50,
  stock_quantity: 50,
  sku: 'QG-LG-001'
})
```

### Scheduling an Appointment

```typescript
import { appointmentsApi } from '@/lib/supabase'

// Check availability first
const isAvailable = await appointmentsApi.checkAvailability(
  'staff-uuid',
  '2024-12-20',
  '14:00',
  60
)

if (isAvailable) {
  const appointment = await appointmentsApi.create({
    customer_id: 'customer-uuid',
    service_id: 'service-uuid',
    staff_id: 'staff-uuid',
    appointment_date: '2024-12-20',
    start_time: '14:00',
    end_time: '15:00',
    total_price: 45.00
  })
}
```

### Creating an Order

```typescript
import { ordersApi } from '@/lib/supabase'

const order = await ordersApi.create({
  customer_id: 'customer-uuid',
  subtotal: 95.50,
  total_amount: 95.50,
  status: 'confirmed',
  payment_status: 'paid'
})

// Add order items
await ordersApi.addItem({
  order_id: order.id,
  product_id: 'product-uuid',
  product_name: 'Lip Gloss Ultra-hydratants',
  quantity: 2,
  unit_price: 28.50,
  total_price: 57.00
})
```

### Managing Inventory

```typescript
import { inventoryApi } from '@/lib/supabase'

// Record a sale
await inventoryApi.recordMovement({
  product_id: 'product-uuid',
  movement_type: 'sale',
  quantity: 2,
  previous_stock: 50,
  new_stock: 48,
  reference_id: 'order-uuid',
  reference_type: 'order'
})
```

## 📈 Dashboard Integration

The database schema includes several views and functions specifically designed for dashboard integration:

### Key Metrics
- Orders in last 30 days
- Upcoming appointments
- New customers
- Revenue tracking
- Low stock alerts

### Real-time Updates
- Appointment status changes
- Order status updates
- Inventory movements
- Customer activity

## 🔍 Monitoring and Maintenance

### Regular Tasks
1. **Backup**: Supabase handles automatic backups
2. **Performance**: Monitor query performance in Supabase dashboard
3. **Security**: Review RLS policies regularly
4. **Data Integrity**: Check for orphaned records periodically

### Common Queries

#### Out of Stock Alert
```sql
SELECT * FROM out_of_stock_products;
```

#### Today's Appointments
```sql
SELECT * FROM todays_appointments;
```

#### Revenue by Month
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total_amount) as revenue
FROM orders 
WHERE status = 'delivered'
GROUP BY month
ORDER BY month DESC;
```

## 🎯 Business Logic

The database schema supports all the business requirements mentioned:

✅ **Appointment Management**
- Schedule appointments with availability checking
- Track appointment status and history
- Support multiple services per appointment

✅ **Product Management**
- Complete product catalog with categories
- Simple in-stock/out-of-stock tracking
- Price management (regular, sale, cost)
- Image management for products

✅ **Service Management**
- Service catalog with pricing and duration
- Category organization
- Active/inactive status management

✅ **Order Management**
- Complete order lifecycle tracking
- Payment status management
- Guest order support
- Order item tracking

✅ **Customer Management**
- Customer profiles and history
- Loyalty points system
- Review and feedback system
- Communication tracking

✅ **Analytics and Reporting**
- Sales analytics
- Customer insights
- Inventory reports
- Performance metrics

This comprehensive database schema provides a solid foundation for managing all aspects of the Queen&apos;s Glam beauty salon business with full type safety and modern development practices. 