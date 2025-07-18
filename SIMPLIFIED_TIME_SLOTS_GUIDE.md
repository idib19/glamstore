# Simplified Time Slots Management Guide

## Overview

The simplified time slots management system provides an easy-to-use interface for configuring weekly recurring schedules with daily availability hours. This system focuses on the most common scheduling needs for beauty salons and similar businesses.

## Features

### 1. Weekly Schedule Management
- **Day-by-day configuration**: Set opening hours for each day of the week
- **Open/Closed toggle**: Easily mark days as open or closed
- **Unavailable time slot management**: Configure daily unavailable time slots (breaks, maintenance, etc.)
- **Quick actions**: Standard week and closed week presets

### 2. Simple Interface
- **Visual day cards**: Each day has its own card with all settings
- **Time inputs**: Simple time pickers for opening/closing hours
- **Checkbox controls**: Easy toggles for open/closed and unavailable slots
- **Bulk operations**: Apply settings to entire weeks

### 3. Integration with Appointment Booking
- **Automatic day filtering**: Only open days appear in the date picker
- **Real-time availability**: Changes immediately affect appointment booking
- **Seamless user experience**: Customers only see available days

## How to Use

### Accessing the Interface
1. Go to the admin dashboard
2. Navigate to Settings
3. Scroll down to "Horaires hebdomadaires" section

### Quick Setup

#### Standard Week
Click "Semaine standard" to set up a typical beauty salon schedule:
- **Monday - Friday**: 9:00 AM - 6:00 PM with unavailable slot (12:00 - 1:00 PM)
- **Saturday**: 10:00 AM - 5:00 PM (no unavailable slot)
- **Sunday**: Closed

#### Closed Week
Click "Fermé toute la semaine" to close the business for all days.

### Manual Configuration

#### For Each Day:
1. **Toggle "Ouvert"**: Check to open the day, uncheck to close
2. **Set "Disponible de"**: Choose when the business opens
3. **Set "Disponible jusqu'à"**: Choose when the business closes
4. **Configure "Créneau indisponible"** (optional):
   - Check "Créneau indisponible" to enable
   - Set unavailable start and end times

#### Example Configuration:
```
Monday: Available 9:00 AM - 6:00 PM, Unavailable 12:00 - 1:00 PM
Tuesday: Available 9:00 AM - 6:00 PM, Unavailable 12:00 - 1:00 PM
Wednesday: Available 9:00 AM - 6:00 PM, Unavailable 12:00 - 1:00 PM
Thursday: Available 9:00 AM - 6:00 PM, Unavailable 12:00 - 1:00 PM
Friday: Available 9:00 AM - 6:00 PM, Unavailable 12:00 - 1:00 PM
Saturday: Available 10:00 AM - 5:00 PM, No unavailable slot
Sunday: Closed
```

### Saving Changes
1. Configure all days as needed
2. Click "Sauvegarder les horaires" at the bottom
3. Wait for confirmation message
4. Changes are immediately applied to appointment booking

## Business Logic

### How It Works
1. **Time Slots Generation**: The system automatically creates time slots based on your configuration
2. **Unavailable Slot Handling**: When unavailable slot is enabled, the system creates separate morning and afternoon slots
3. **Appointment Availability**: Only regular slots (not unavailable slots) are available for appointments
4. **Conflict Prevention**: The system prevents double-booking and respects configured hours
5. **Date Picker Integration**: Only days marked as "Ouvert" appear in the appointment booking date picker

### Slot Types Created
- **Regular Slots**: Available for appointments
- **Unavailable Slots**: Unavailable for appointments (break time, maintenance, etc.)

### Example Time Slots Generated
For a day with 9:00 AM - 6:00 PM and unavailable slot 12:00 - 1:00 PM:
```
09:00 - 12:00: Regular slot (available)
12:00 - 13:00: Unavailable slot (unavailable)
13:00 - 18:00: Regular slot (available)
```

### Date Picker Integration
- **Automatic Filtering**: The appointment booking date picker only shows days that are configured as open
- **Real-time Updates**: Changes to the weekly schedule immediately affect the date picker
- **Fallback Behavior**: If there's an error loading available days, all days are shown (safety measure)

## Benefits

### For Administrators
- **Simple Setup**: No complex slot management needed
- **Quick Changes**: Easy to modify hours or close days
- **Visual Interface**: Clear day-by-day view
- **Bulk Operations**: Set entire weeks at once
- **Automatic Integration**: Changes immediately affect customer booking

### For Customers
- **Accurate Availability**: Real-time availability based on configured hours
- **Clear Information**: Shows available times based on business hours
- **No Confusion**: Only open days appear in the date picker
- **Better UX**: No need to select dates that are closed

### For Business
- **Operational Efficiency**: Easy to manage and update schedules
- **Customer Satisfaction**: Accurate booking availability
- **Flexibility**: Easy to adjust for holidays or special events
- **Reduced Errors**: Customers can't book on closed days

## Common Use Cases

### Regular Business Week
- Use "Semaine standard" for typical beauty salon hours
- Adjust individual days as needed

### Holiday Closures
- Use "Fermé toute la semaine" for complete closures
- Or manually uncheck specific days

### Special Hours
- Modify individual days for special events
- Adjust unavailable slots for different days

### Weekend Only
- Close Monday-Friday
- Set custom hours for Saturday/Sunday

### Maintenance Days
- Set unavailable slots for equipment maintenance
- Configure longer unavailable periods for deep cleaning

## Tips

1. **Plan Ahead**: Set up your schedule before customers start booking
2. **Test Booking**: Try booking an appointment to verify your configuration
3. **Regular Updates**: Update hours for holidays or special events
4. **Unavailable Slots**: Use for lunch breaks, maintenance, or staff meetings
5. **Consistency**: Keep similar hours for weekdays when possible
6. **Customer Communication**: Inform customers about any schedule changes

## Troubleshooting

### Common Issues
1. **Slots Not Showing**: Make sure the day is marked as "Ouvert"
2. **Wrong Times**: Check that opening time is before closing time
3. **Unavailable Slot Issues**: Ensure unavailable start is before unavailable end
4. **No Availability**: Verify the day is open and times are correct
5. **Date Picker Issues**: Check that available days are properly loaded

### Getting Help
- Check that all time inputs are valid
- Ensure opening time is before closing time
- Verify unavailable slot times are within business hours
- Try the quick setup buttons for standard configurations
- Check browser console for any error messages

## Technical Details

### Database Integration
- **Time Slots Table**: Stores individual time slots for each day
- **Availability Checking**: Real-time validation against configured slots
- **Date Filtering**: Automatic filtering based on open/closed status

### API Functions
- **getAvailableDays()**: Returns list of days that have open slots
- **getByDayOrganized()**: Returns time slots organized by day
- **checkAvailability()**: Validates appointment availability

### Component Integration
- **DatePicker**: Automatically filters available days
- **TimePicker**: Shows available time slots based on configuration
- **TimeSlotsManager**: Admin interface for weekly schedule management

## Conclusion

The simplified time slots management system provides an intuitive way to configure weekly business hours. It automatically handles the complexity of time slot generation while providing a simple interface for day-to-day management. The integration with the appointment booking system ensures that customers only see available days and times, creating a seamless booking experience. 