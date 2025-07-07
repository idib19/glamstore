# Database Setup Guide

## Overview

This guide explains how to set up the Queen's Glam database with the new schema that includes real-time product ratings and enhanced functionality.

## Prerequisites

1. **Supabase Project**: You need a Supabase project set up
2. **Database Access**: Access to the Supabase SQL editor or database
3. **Environment Variables**: Configure your `.env.local` file with Supabase credentials

## Setup Options

### Option 1: Complete Fresh Setup (Recommended)

If you're setting up the database for the first time or want to start completely fresh:

1. **Run the main schema file**:
   ```sql
   -- Copy and paste the entire content of supabase-schema.sql
   -- into your Supabase SQL editor and execute it
   ```

This will:
- ✅ Drop all existing tables, views, and functions
- ✅ Create all new tables with proper relationships
- ✅ Set up indexes for performance
- ✅ Create triggers for automation
- ✅ Set up Row Level Security (RLS)
- ✅ Insert sample data
- ✅ Create views for common queries
- ✅ Set up business logic functions

### Option 2: Cleanup First, Then Setup

If you want to be extra careful or run the cleanup separately:

1. **Run the cleanup script first**:
   ```sql
   -- Copy and paste the content of cleanup-database.sql
   -- into your Supabase SQL editor and execute it
   ```

2. **Then run the main schema**:
   ```sql
   -- Copy and paste the content of supabase-schema.sql
   -- into your Supabase SQL editor and execute it
   ```

## What Gets Created

### Tables
- `users` - Admin/staff users
- `customers` - Customer information
- `product_categories` - Product categories
- `products` - Product catalog
- `product_images` - Product images
- `service_categories` - Service categories
- `services` - Service offerings
- `appointments` - Appointment bookings
- `appointment_services` - Multiple services per appointment
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product/service reviews
- `loyalty_transactions` - Loyalty program
- `promotions` - Discounts and coupons
- `notifications` - Customer notifications
- `sales_analytics` - Analytics data

### Views
- `product_ratings` - Products with calculated ratings and review counts
- `dashboard_overview` - Dashboard metrics
- `out_of_stock_products` - Products that are out of stock
- `todays_appointments` - Today's appointments

### Functions
- `check_appointment_availability()` - Check if time slot is available
- `calculate_appointment_end_time()` - Calculate appointment end time
- `get_customer_loyalty_points()` - Get customer loyalty points
- `generate_order_number()` - Generate unique order numbers
- `update_customer_total_spent()` - Update customer spending totals

## Sample Data Included

### Categories
- **Lip Gloss** - Lip gloss products
- **Masques à Lèvres** - Lip masks
- **Perruques Naturelles** - Natural hair wigs

### Products (7 total)
- Lip Gloss Ultra Hydratant (Featured)
- Lip Gloss Fini Matte
- Lip Gloss Brillant
- Masque à Lèvres (Featured)
- Masque à Lèvres Exfoliant
- Perruques Naturelles Premium (Featured)
- Perruques Lace Front

### Reviews (8 total)
- Various ratings (4-5 stars) for different products
- Realistic customer names and comments

### Services (4 total)
- Manucure & Pédicure
- Pose de Perruques
- Coiffure de Perruques
- Soins de Perruques

## Verification Steps

After running the setup, verify everything is working:

### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### 2. Check Views Exist
```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 3. Check Sample Data
```sql
-- Check products with ratings
SELECT * FROM product_ratings;

-- Check categories
SELECT * FROM product_categories;

-- Check reviews
SELECT * FROM reviews;
```

### 4. Test the Product Ratings View
```sql
-- This should return products with ratings and review counts
SELECT 
    name,
    category_name,
    average_rating,
    review_count,
    price
FROM product_ratings
ORDER BY is_featured DESC, average_rating DESC;
```

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues

1. **"Table already exists" error**
   - Run the cleanup script first, then the main schema

2. **"Function already exists" error**
   - The cleanup script should handle this, but you can manually drop functions

3. **"View already exists" error**
   - The cleanup script should handle this, but you can manually drop views

4. **Permission errors**
   - Make sure you have admin access to your Supabase project
   - Check that RLS policies are set up correctly

### Manual Cleanup Commands

If you need to manually clean up specific items:

```sql
-- Drop specific table
DROP TABLE IF EXISTS table_name CASCADE;

-- Drop specific view
DROP VIEW IF EXISTS view_name CASCADE;

-- Drop specific function
DROP FUNCTION IF EXISTS function_name(parameters) CASCADE;
```

## Next Steps

After successful setup:

1. **Test the Products Page**: Visit `/produits` to see the database integration
2. **Check Real-time Updates**: Add a review in the database and see it update live
3. **Configure RLS**: Adjust Row Level Security policies as needed
4. **Add More Data**: Add your actual products, services, and categories

## Support

If you encounter any issues:

1. Check the Supabase logs in your project dashboard
2. Verify all environment variables are set correctly
3. Ensure you have the latest version of the schema file
4. Check that all dependencies are installed in your Next.js project

The database is now ready for real-time product management with the Queen's Glam application! 🎉 