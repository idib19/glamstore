# Unified Schedule Management System

## Overview

The Unified Schedule Management System combines weekly availability settings and daily time slots into a single, simplified interface. This system allows administrators to configure both the date range when schedules are effective and the daily opening hours for each day of the week.

## Features

### 1. **Date Range Configuration**
- **Effective From**: Set the start date when the schedule takes effect
- **Effective Until**: Set the end date when the schedule expires
- **Automatic Validation**: Ensures end date is after start date

### 2. **Daily Schedule Management**
- **Day-by-day configuration**: Set opening hours for each day (Monday to Sunday)
- **Open/Closed toggle**: Easily mark days as open or closed
- **Time inputs**: Simple time pickers for opening and closing hours
- **Visual day cards**: Each day has its own card with all settings

### 3. **Quick Actions**
- **Standard Week**: Sets typical business hours (9 AM - 6 PM weekdays, 10 AM - 5 PM weekends)
- **Closed Week**: Closes all days for the entire period

### 4. **Database Integration**
- **Time Slots Table**: Stores individual time slots for each day
- **Store Data Table**: Stores the effective date range
- **Automatic Sync**: Changes immediately affect appointment booking

## How to Use

### Accessing the Interface
1. Go to the admin dashboard
2. Navigate to Settings
3. Find the "Configuration des horaires" section

### Setting Up Your Schedule

#### 1. Configure Date Range
- **À partir du**: Choose when the schedule starts (e.g., today)
- **Jusqu'au**: Choose when the schedule ends (e.g., 1 year from now)

#### 2. Set Daily Hours
For each day of the week:
1. **Toggle "Ouvert"**: Check to open the day, uncheck to close
2. **Set "Heure d'ouverture"**: Choose when the business opens
3. **Set "Heure de fermeture"**: Choose when the business closes

#### 3. Quick Setup Options
- **Semaine standard**: Sets typical beauty salon hours
- **Fermé toute la semaine**: Closes all days

#### 4. Save Changes
Click "Sauvegarder les horaires" to apply all changes

## Example Configuration

```
Date Range: January 1, 2024 - December 31, 2024

Monday: 9:00 AM - 6:00 PM (Open)
Tuesday: 9:00 AM - 6:00 PM (Open)
Wednesday: 9:00 AM - 6:00 PM (Open)
Thursday: 9:00 AM - 6:00 PM (Open)
Friday: 9:00 AM - 6:00 PM (Open)
Saturday: 10:00 AM - 5:00 PM (Open)
Sunday: Closed
```

## Business Logic

### How It Works
1. **Date Range Validation**: System checks if selected dates are within the effective period
2. **Time Slot Generation**: Creates time slots based on daily opening hours
3. **Appointment Availability**: Only open days within the effective period are available
4. **Real-time Updates**: Changes immediately affect the appointment booking system

### Database Structure
- **time_slots table**: Stores daily time slots with availability status
- **store_data table**: Stores the effective date range in availability_settings
- **Automatic Integration**: Appointment booking system checks both tables

### Time Slot Generation
For each open day, the system creates:
```
Single slot: 09:00 - 18:00 (available for appointments)
```

## Benefits

### For Administrators
- **Single Interface**: All scheduling in one place
- **Date Range Control**: Set when schedules are effective
- **Simple Configuration**: Easy day-by-day setup
- **Quick Actions**: Standard configurations at the click of a button

### For Customers
- **Accurate Availability**: Only sees available days within the effective period
- **Clear Information**: No confusion about when the business is open
- **Better UX**: Can't book outside the configured date range

### For Business
- **Operational Efficiency**: Easy to manage schedules for different periods
- **Flexibility**: Can set different schedules for different time periods
- **Reduced Errors**: Automatic validation prevents invalid configurations

## Common Use Cases

### Regular Business Schedule
- Set date range for the entire year
- Configure standard weekly hours
- Use "Semaine standard" for quick setup

### Holiday Closures
- Set specific date ranges for holidays
- Use "Fermé toute la semaine" for complete closures
- Configure reduced hours for holiday periods

### Seasonal Hours
- Set different schedules for summer/winter
- Configure weekend-only schedules
- Adjust hours for special events

### Temporary Closures
- Set short date ranges for maintenance
- Configure emergency closures
- Set reduced hours during slow periods

## Technical Implementation

### Components
- **UnifiedScheduleManager**: Main component for schedule configuration
- **DatePicker**: Enhanced to respect available days
- **TimePicker**: Shows available slots based on configuration

### API Functions
- **timeSlotsApi.getByDayOrganized()**: Loads existing schedule
- **timeSlotsApi.bulkCreate()**: Saves daily time slots
- **timeSlotsApi.saveScheduleDateRange()**: Saves effective date range
- **timeSlotsApi.getAvailableDays()**: Gets list of open days

### Database Tables
```sql
-- time_slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY,
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN,
  slot_type VARCHAR(50),
  notes TEXT
);

-- store_data table (availability_settings field)
{
  "available_from": "2024-01-01",
  "available_until": "2024-12-31",
  "working_days": ["monday", "tuesday", ...]
}
```

## Integration with Appointment Booking

### Date Picker Filtering
- Only shows days that are configured as open
- Respects the effective date range
- Real-time updates when schedule changes

### Time Slot Availability
- Shows available time slots based on daily hours
- Prevents booking outside configured hours
- Handles service duration conflicts

### Validation
- Checks if selected date is within effective period
- Validates that day is configured as open
- Ensures time slots are available for service duration

## Tips for Best Practices

1. **Plan Ahead**: Set up schedules well in advance
2. **Regular Updates**: Update schedules for holidays and special events
3. **Test Booking**: Verify configuration by testing appointment booking
4. **Clear Communication**: Inform customers about schedule changes
5. **Backup Configuration**: Keep records of different schedule periods

## Troubleshooting

### Common Issues
1. **No Available Dates**: Check if date range is set correctly
2. **Wrong Times**: Verify opening/closing hours are set properly
3. **Schedule Not Loading**: Check database connection and permissions
4. **Date Range Errors**: Ensure end date is after start date

### Getting Help
- Check browser console for error messages
- Verify all required fields are filled
- Test with standard week configuration
- Check database for existing schedule data

## Conclusion

The Unified Schedule Management System provides a comprehensive solution for managing business hours and availability. It combines the simplicity of daily configuration with the flexibility of date range control, creating a powerful yet easy-to-use scheduling system that integrates seamlessly with the appointment booking process. 