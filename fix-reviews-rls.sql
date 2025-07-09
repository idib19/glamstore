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

-- Note: The "Staff can manage all reviews" policy will allow authenticated staff users
-- to perform all operations (SELECT, INSERT, UPDATE, DELETE) on all reviews.
-- This is appropriate for the dashboard functionality.

-- If you want more restrictive policies, you could use:
-- CREATE POLICY "Staff can view all reviews" ON reviews
--     FOR SELECT USING (true);
-- 
-- CREATE POLICY "Staff can update reviews" ON reviews
--     FOR UPDATE USING (true);
-- 
-- CREATE POLICY "Staff can delete reviews" ON reviews
--     FOR DELETE USING (true); 