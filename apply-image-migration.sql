-- Add image_url column to services table
-- Run this in your Supabase SQL Editor

-- Check if column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE services ADD COLUMN image_url VARCHAR(500);
        RAISE NOTICE '✅ Added image_url column to services table';
    ELSE
        RAISE NOTICE 'ℹ️ image_url column already exists in services table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url'; 