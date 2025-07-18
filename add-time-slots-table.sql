-- Add time_slots table for detailed time slot management
-- Execute this in your Supabase SQL Editor

-- ========================================
-- TIME SLOTS TABLE
-- ========================================

-- Time slots table for detailed availability management
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    slot_type VARCHAR(50) DEFAULT 'regular' CHECK (slot_type IN ('regular', 'break', 'maintenance', 'lunch', 'cleaning')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end_time is after start_time
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);

-- ========================================
-- INDEXES
-- ========================================

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_time_slots_type ON time_slots(slot_type);
CREATE INDEX IF NOT EXISTS idx_time_slots_day_time ON time_slots(day_of_week, start_time, end_time);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert default time slots for each working day
-- Monday to Friday: 9:00-12:00, 13:00-18:00 (with lunch break)
-- Saturday: 10:00-17:00
-- Sunday: No slots (closed)

-- Monday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('monday', '09:00', '12:00', true, 'regular', 'Morning shift'),
('monday', '12:00', '13:00', false, 'lunch', 'Lunch break'),
('monday', '13:00', '18:00', true, 'regular', 'Afternoon shift');

-- Tuesday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('tuesday', '09:00', '12:00', true, 'regular', 'Morning shift'),
('tuesday', '12:00', '13:00', false, 'lunch', 'Lunch break'),
('tuesday', '13:00', '18:00', true, 'regular', 'Afternoon shift');

-- Wednesday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('wednesday', '09:00', '12:00', true, 'regular', 'Morning shift'),
('wednesday', '12:00', '13:00', false, 'lunch', 'Lunch break'),
('wednesday', '13:00', '18:00', true, 'regular', 'Afternoon shift');

-- Thursday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('thursday', '09:00', '12:00', true, 'regular', 'Morning shift'),
('thursday', '12:00', '13:00', false, 'lunch', 'Lunch break'),
('thursday', '13:00', '18:00', true, 'regular', 'Afternoon shift');

-- Friday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('friday', '09:00', '12:00', true, 'regular', 'Morning shift'),
('friday', '12:00', '13:00', false, 'lunch', 'Lunch break'),
('friday', '13:00', '18:00', true, 'regular', 'Afternoon shift');

-- Saturday
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_type, notes) VALUES
('saturday', '10:00', '17:00', true, 'regular', 'Weekend shift');

-- Sunday (closed - no slots)

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to get available time slots for a specific day
CREATE OR REPLACE FUNCTION get_available_time_slots(
    p_day_of_week VARCHAR(20),
    p_slot_duration INTEGER DEFAULT 30
)
RETURNS TABLE (
    start_time TIME,
    end_time TIME,
    slot_type VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.start_time,
        ts.end_time,
        ts.slot_type
    FROM time_slots ts
    WHERE ts.day_of_week = p_day_of_week
      AND ts.is_available = true
      AND ts.slot_type = 'regular'
    ORDER BY ts.start_time;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a specific time is within available slots
CREATE OR REPLACE FUNCTION is_time_in_available_slot(
    p_day_of_week VARCHAR(20),
    p_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM time_slots
    WHERE day_of_week = p_day_of_week
      AND is_available = true
      AND slot_type = 'regular'
      AND p_time >= start_time
      AND p_time < end_time;
    
    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- UPDATED APPOINTMENT AVAILABILITY FUNCTION
-- ========================================

-- Enhanced function to check appointment availability with time slots
CREATE OR REPLACE FUNCTION check_appointment_availability_enhanced(
    p_appointment_date DATE,
    p_start_time TIME,
    p_duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_end_time TIME;
    v_conflicting_appointments INTEGER;
    v_day_of_week VARCHAR(20);
    v_start_available BOOLEAN;
    v_end_available BOOLEAN;
BEGIN
    -- Get day of week
    v_day_of_week := LOWER(TO_CHAR(p_appointment_date, 'day'));
    
    -- Calculate end time
    v_end_time := p_start_time + (p_duration_minutes || ' minutes')::INTERVAL;
    
    -- Check if start time is within available slots
    v_start_available := is_time_in_available_slot(v_day_of_week, p_start_time);
    
    -- Check if end time is within available slots
    v_end_available := is_time_in_available_slot(v_day_of_week, v_end_time);
    
    -- If either time is not available, return false
    IF NOT v_start_available OR NOT v_end_available THEN
        RETURN false;
    END IF;
    
    -- Check for conflicting appointments
    SELECT COUNT(*) INTO v_conflicting_appointments
    FROM appointments
    WHERE appointment_date = p_appointment_date
      AND status NOT IN ('cancelled', 'no_show')
      AND (
          (start_time < v_end_time AND end_time > p_start_time)
      );
    
    RETURN v_conflicting_appointments = 0;
END;
$$ LANGUAGE plpgsql; 