# Time Slots Management System

## Overview

The Time Slots Management System provides detailed control over appointment availability by allowing administrators to configure specific time slots for each day of the week. This system goes beyond simple working days and business hours to provide granular control over when appointments can be booked.

## Features

### 1. Granular Time Slot Control
- **Day-by-day configuration**: Set different time slots for each day of the week
- **Multiple slot types**: Regular, break, maintenance, lunch, cleaning
- **Availability flags**: Mark slots as available or unavailable for appointments
- **Time precision**: Set exact start and end times for each slot

### 2. Slot Types
- **Regular**: Normal appointment slots
- **Break**: Staff breaks (unavailable for appointments)
- **Maintenance**: Equipment maintenance periods
- **Lunch**: Lunch breaks
- **Cleaning**: Cleaning periods

### 3. Quick Actions
- **Standard Day**: 9:00-12:00, 12:00-13:00 (lunch), 13:00-18:00
- **Weekend**: 10:00-17:00
- **Closed**: No slots available
- **Custom**: Manual slot configuration

## Database Schema

### Time Slots Table
```sql
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    slot_type VARCHAR(50) DEFAULT 'regular' CHECK (slot_type IN ('regular', 'break', 'maintenance', 'lunch', 'cleaning')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);
```

### Enhanced Availability Function
```sql
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
```

## API Functions

### Time Slots API
```typescript
export const timeSlotsApi = {
  // Get all time slots
  getAll: async () => Promise<TimeSlot[]>,
  
  // Get time slots by day
  getByDay: async (dayOfWeek: string) => Promise<TimeSlot[]>,
  
  // Get available time slots for a specific day
  getAvailableSlots: async (dayOfWeek: string) => Promise<TimeSlot[]>,
  
  // Create new time slot
  create: async (timeSlot: TimeSlotInsert) => Promise<TimeSlot>,
  
  // Update time slot
  update: async (id: string, updates: TimeSlotUpdate) => Promise<TimeSlot>,
  
  // Delete time slot
  delete: async (id: string) => Promise<void>,
  
  // Bulk create time slots for a day
  bulkCreate: async (dayOfWeek: string, slots: TimeSlotConfig[]) => Promise<TimeSlot[]>,
  
  // Get time slots organized by day
  getByDayOrganized: async () => Promise<Record<string, TimeSlot[]>>
}
```

## Admin Interface

### TimeSlotsManager Component
The `TimeSlotsManager` component provides a comprehensive interface for managing time slots:

#### Features
- **Day Selection**: Switch between days of the week
- **Quick Actions**: Standard day, weekend, closed configurations
- **Slot Management**: Add, edit, delete individual slots
- **Visual Indicators**: Color-coded slot types and availability status
- **Bulk Operations**: Configure entire days at once

#### Usage
```tsx
import TimeSlotsManager from '../components/TimeSlotsManager';

function SettingsPage() {
  return (
    <div>
      <TimeSlotsManager onTimeSlotsUpdated={() => {
        // Refresh appointment availability
      }} />
    </div>
  );
}
```

## Integration with Appointment Booking

### Enhanced Availability Checking
The appointment booking system now uses the enhanced availability function that:

1. **Checks working days**: Verifies the selected date is a working day
2. **Validates date range**: Ensures the date is within availability settings
3. **Validates time slots**: Confirms the requested time falls within available slots
4. **Checks conflicts**: Prevents double-booking with existing appointments

### Fallback Mechanism
If the enhanced function is not available (e.g., during migration), the system falls back to the original availability checking function.

## Migration Guide

### 1. Database Migration
Execute the SQL migration file:
```sql
-- Run add-time-slots-table.sql in your Supabase SQL Editor
```

### 2. Update Types
The database types have been updated to include the `time_slots` table and `TimeSlot` type.

### 3. Component Integration
Add the `TimeSlotsManager` component to your admin settings page.

### 4. API Updates
The appointments API now uses enhanced availability checking with fallback support.

## Default Configuration

### Sample Time Slots
The migration includes default time slots for a typical beauty salon:

#### Monday - Friday
- **09:00 - 12:00**: Morning shift (available)
- **12:00 - 13:00**: Lunch break (unavailable)
- **13:00 - 18:00**: Afternoon shift (available)

#### Saturday
- **10:00 - 17:00**: Weekend shift (available)

#### Sunday
- No slots (closed)

## Business Logic

### Availability Rules
1. **Working Days**: Only days marked as working days in availability settings
2. **Date Range**: Within the configured available_from and available_until dates
3. **Time Slots**: Requested time must fall within available regular slots
4. **No Conflicts**: No overlapping appointments
5. **Slot Types**: Only regular slots are available for appointments

### Slot Validation
- Start time must be before end time
- Slots cannot overlap within the same day
- Only regular slots are considered for appointment booking
- Break, maintenance, lunch, and cleaning slots are unavailable

## Benefits

### For Administrators
- **Flexible Scheduling**: Configure different schedules for each day
- **Break Management**: Properly manage staff breaks and maintenance
- **Visual Management**: Easy-to-use interface with clear indicators
- **Bulk Operations**: Quick setup for common configurations

### For Customers
- **Accurate Availability**: Real-time availability based on actual slots
- **No Double-booking**: Prevents scheduling conflicts
- **Clear Information**: Shows available times based on configured slots

### For Business
- **Operational Efficiency**: Better resource management
- **Customer Satisfaction**: Accurate booking availability
- **Staff Management**: Proper break and maintenance scheduling
- **Scalability**: Easy to modify schedules as business grows

## Future Enhancements

### Potential Features
1. **Recurring Slots**: Set up recurring time slots (weekly, monthly)
2. **Staff-specific Slots**: Different slots for different staff members
3. **Seasonal Schedules**: Different schedules for different seasons
4. **Holiday Management**: Special schedules for holidays
5. **Capacity Management**: Multiple appointments per slot
6. **Waitlist Management**: Waitlist for unavailable slots

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live updates
2. **Mobile Interface**: Mobile-optimized time slot management
3. **Analytics**: Time slot usage analytics
4. **API Rate Limiting**: Protect against abuse
5. **Caching**: Improve performance with caching

## Troubleshooting

### Common Issues
1. **Slots Not Showing**: Check if time slots are configured for the selected day
2. **Availability Errors**: Verify slot types and availability flags
3. **Time Conflicts**: Ensure slots don't overlap
4. **Migration Issues**: Check database function availability

### Debug Information
The system includes comprehensive logging for debugging:
- Availability check results
- Slot validation errors
- API call responses
- Fallback function usage

## Conclusion

The Time Slots Management System provides a comprehensive solution for managing appointment availability with granular control over scheduling. It enhances the existing appointment booking system while maintaining backward compatibility and providing a smooth migration path. 