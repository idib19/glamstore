-- Migration: Add image_url field to service_categories table
-- This migration adds an image_url field to the service_categories table for design purposes

-- Add the image_url column to service_categories table
ALTER TABLE service_categories 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add a comment to document the new field
COMMENT ON COLUMN service_categories.image_url IS 'URL of the service category image for design purposes';

-- Update the TypeScript types will need to be regenerated after this migration
-- Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts 