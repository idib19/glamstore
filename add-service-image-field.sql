-- Add image_url field to services table
ALTER TABLE services 
ADD COLUMN image_url VARCHAR(500);

-- Add comment to document the field
COMMENT ON COLUMN services.image_url IS 'URL of the service image for display purposes'; 