-- Migration: Fix service image_url column to TEXT type
-- This fixes the "value too long for type character varying(500)" error
-- Run this in your Supabase SQL Editor

-- Step 1: Check current column type
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url';

-- Step 2: Alter the column to TEXT type (handles unlimited length)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'image_url'
    ) THEN
        -- Column exists, alter it to TEXT
        ALTER TABLE services ALTER COLUMN image_url TYPE TEXT;
        RAISE NOTICE '✅ Successfully changed image_url column to TEXT type';
    ELSE
        -- Column doesn't exist, create it as TEXT
        ALTER TABLE services ADD COLUMN image_url TEXT;
        RAISE NOTICE '✅ Successfully created image_url column as TEXT type';
    END IF;
END $$;

-- Step 3: Verify the change
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url';

-- Step 4: Add comment
COMMENT ON COLUMN services.image_url IS 'URL of the service image for display purposes (supports long data URLs)'; 