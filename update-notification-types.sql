-- Update notification types to include appointment_confirmation and order_confirmation
-- This migration adds the new notification types to the existing notifications table

-- First, drop the existing check constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add the new check constraint with updated notification types
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('appointment_reminder', 'appointment_confirmation', 'appointment_details_update', 'order_update', 'order_confirmation', 'promotion', 'birthday', 'system'));

-- Verify the update
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'notifications' AND column_name = 'type';

-- Show the current check constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'notifications'::regclass AND contype = 'c'; 