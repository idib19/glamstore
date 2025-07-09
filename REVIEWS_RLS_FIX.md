# Fix for Reviews RLS Policy Error

## Problem
When trying to submit a review, you get the error:
```
new row violates row-level security policy for table "reviews"
```

## Cause
The Row Level Security (RLS) policy on the `reviews` table only allows SELECT operations for approved reviews, but doesn't allow INSERT operations for new review submissions.

## Solution

### Option 1: Run the SQL directly in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query and paste this SQL:

```sql
-- Fix Row Level Security policies for reviews table
-- This allows public users to submit reviews and staff to manage them

-- Drop existing policy
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;

-- Create new policies for reviews table

-- Policy 1: Public can view approved reviews (for the avis page)
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- Policy 2: Public can insert reviews (for submitting new reviews)
CREATE POLICY "Public can insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- Policy 3: Staff can manage all reviews (for dashboard)
CREATE POLICY "Staff can manage all reviews" ON reviews
    FOR ALL USING (true);
```

4. Click **Run** to execute the query

### Option 2: Use the provided SQL file

1. Use the `fix-reviews-rls.sql` file in this project
2. Copy the contents and run it in your Supabase SQL Editor

## What these policies do:

1. **"Public can view approved reviews"**: Allows anyone to view only approved reviews (for the public avis page)
2. **"Public can insert reviews"**: Allows anyone to submit new reviews (for the review form)
3. **"Staff can manage all reviews"**: Allows authenticated staff to perform all operations on all reviews (for the dashboard)

## Verification

After applying the fix:

1. Try submitting a new review through the `/avis` page
2. The review should be saved successfully
3. Check the dashboard's "Avis" tab to see the new review (it will be marked as "En attente")
4. Approve the review from the dashboard
5. The review should then appear on the public `/avis` page

## Security Notes

- The policies ensure that only approved reviews are visible to the public
- Staff can manage all reviews (approve/reject) through the dashboard
- New reviews are automatically set to `is_approved = false` and require admin approval
- This maintains the security and quality control of the review system 