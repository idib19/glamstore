-- Fix service image_url column to handle longer image data URLs
-- Run this in your Supabase SQL Editor

-- First, check if the column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'image_url'
    ) THEN
        -- Alter the column to TEXT type
        ALTER TABLE services ALTER COLUMN image_url TYPE TEXT;
        RAISE NOTICE '✅ Changed image_url column to TEXT type';
    ELSE
        -- Create the column if it doesn't exist
        ALTER TABLE services ADD COLUMN image_url TEXT;
        RAISE NOTICE '✅ Added image_url column as TEXT type';
    END IF;
END $$;

-- Verify the column type
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url'; 