# Applying Service Image Migration

## Issue
The service update is failing because the `image_url` column doesn't exist in the database yet.

## Solution

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
-- Add image_url field to services table (TEXT type for longer image data URLs)
ALTER TABLE services 
ADD COLUMN image_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN services.image_url IS 'URL of the service image for display purposes (supports long data URLs)';
```

### Option 2: Using the test script
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `test-service-schema.sql`
4. Run the script

### Option 3: Using psql (if you have direct database access)
```bash
psql -h your-db-host -U your-username -d your-database -f add-service-image-field.sql
```

## Verification
After running the migration, you can verify it worked by running:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'image_url';
```

This should return a row showing the `image_url` column.

## After Migration
Once the migration is applied:
1. Uncomment the `image_url` line in `EditServiceModal.tsx`
2. Test the service update functionality
3. The image upload should now work correctly 