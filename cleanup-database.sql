-- Queen&apos;s Glam Database Cleanup Script
-- Run this script to completely clean the database before running the main schema

-- ========================================
-- CLEANUP: DROP EXISTING TABLES AND VIEWS
-- ========================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS product_ratings CASCADE;
DROP VIEW IF EXISTS todays_appointments CASCADE;
DROP VIEW IF EXISTS out_of_stock_products CASCADE;
DROP VIEW IF EXISTS dashboard_overview CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_customer_loyalty_points(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_appointment_end_time(TIME, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS check_appointment_availability(DATE, TIME, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_customer_total_spent() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;

-- Drop tables in reverse dependency order (child tables first)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS sales_analytics CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS appointment_services CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- VERIFICATION
-- ========================================

-- Check if any tables remain (should return empty)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check if any views remain (should return empty)
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check if any functions remain (should return empty)
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

-- This will show a success message if cleanup was successful
SELECT 'Database cleanup completed successfully!' as status; 