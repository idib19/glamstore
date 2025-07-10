-- Test script to check if image_url column exists in services table
-- Run this in your database to verify the schema

-- Check if the column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url';

-- If the column doesn't exist, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE services ADD COLUMN image_url VARCHAR(500);
        RAISE NOTICE 'Added image_url column to services table';
    ELSE
        RAISE NOTICE 'image_url column already exists in services table';
    END IF;
END $$;

-- Show all columns in services table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position; 