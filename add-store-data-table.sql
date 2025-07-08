-- Add store_data table for Queen's Glam
-- Execute this in your Supabase SQL Editor

-- ========================================
-- STORE DATA TABLE
-- ========================================

-- Store data table (for store settings and information)
CREATE TABLE IF NOT EXISTS store_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(255) NOT NULL DEFAULT 'Queen''s Glam',
    store_description TEXT,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'France',
    phone VARCHAR(20),
    contact_email VARCHAR(255),
    website_url VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    twitter_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    youtube_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    opening_hours JSONB, -- Store opening hours for each day
    availability_settings JSONB, -- Store availability date ranges for appointments
    business_hours JSONB, -- Store business hours for each day
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    currency VARCHAR(3) DEFAULT 'EUR',
    timezone VARCHAR(50) DEFAULT 'Europe/Paris',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

-- Store data index
CREATE INDEX IF NOT EXISTS idx_store_data_active ON store_data(is_active);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert default store data (only if no data exists)
INSERT INTO store_data (
    store_name, 
    store_description, 
    address, 
    city, 
    postal_code, 
    phone, 
    contact_email,
    opening_hours,
    availability_settings,
    business_hours
) 
SELECT 
    'Queen''s Glam',
    'Votre destination beauté premium pour des produits et services de qualité exceptionnelle',
    '123 Rue de la Beauté',
    'Paris',
    '75001',
    '+33 1 23 45 67 89',
    'contact@queensglam.com',
    '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "10:00", "close": "17:00"}, "sunday": {"open": "closed", "close": "closed"}}',
    '{"available_from": "2024-01-01", "available_until": "2024-12-31", "excluded_dates": [], "working_days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}',
    '{"monday": {"start": "09:00", "end": "18:00"}, "tuesday": {"start": "09:00", "end": "18:00"}, "wednesday": {"start": "09:00", "end": "18:00"}, "thursday": {"start": "09:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "18:00"}, "saturday": {"start": "10:00", "end": "17:00"}, "sunday": {"start": "closed", "end": "closed"}}'
WHERE NOT EXISTS (SELECT 1 FROM store_data WHERE is_active = true);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on store_data table
ALTER TABLE store_data ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (you can customize this based on your needs)
CREATE POLICY "Allow all operations on store_data" ON store_data
    FOR ALL USING (true);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check if the table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'store_data' 
ORDER BY ordinal_position;

-- Check if sample data was inserted
SELECT 
    store_name,
    contact_email,
    city,
    is_active,
    created_at
FROM store_data 
WHERE is_active = true; 