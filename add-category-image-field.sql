-- Migration: Add image_url field to product_categories table
-- This migration adds an image_url field to the product_categories table for design purposes

-- Add the image_url column to product_categories table
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add a comment to document the new field
COMMENT ON COLUMN product_categories.image_url IS 'URL of the category image for design purposes';

-- Update the TypeScript types will need to be regenerated after this migration
-- Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts 