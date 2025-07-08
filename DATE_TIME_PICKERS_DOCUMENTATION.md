# Date & Time Picker Components - Documentation

## Overview

Custom, user-friendly date and time picker components designed specifically for the Queen&apos;s Glam appointment booking system. These components provide an intuitive and beautiful interface for selecting appointment dates and times.

## Components

### 1. DatePicker Component

A beautiful calendar-based date picker with French localization and business logic integration.

#### Features
- **Calendar Navigation**: Previous/next month navigation
- **Date Selection**: Click to select dates with visual feedback
- **Date Validation**: Prevents selection of past dates and enforces min/max date ranges
- **Visual Indicators**: 
  - Today's date highlighted with pink border
  - Selected date with primary pink background
  - Disabled dates (past dates) with reduced opacity
- **French Localization**: Week days and months in French
- **Accessibility**: Keyboard navigation (Escape to close)
- **Clear Function**: X button to clear selected date
- **Outside Click**: Closes when clicking outside the picker

#### Props
```typescript
interface DatePickerProps {
  value: string;                    // Current selected date (YYYY-MM-DD format)
  onChange: (date: string) => void; // Callback when date is selected
  minDate?: string;                 // Minimum selectable date
  maxDate?: string;                 // Maximum selectable date
  placeholder?: string;             // Input placeholder text
  className?: string;               // Additional CSS classes
  disabled?: boolean;               // Disable the picker
}
```

#### Usage Example
```tsx
import DatePicker from '../components/DatePicker';

function AppointmentForm() {
  const [selectedDate, setSelectedDate] = useState('');
  
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <DatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      minDate={getMinDate()}
      maxDate={getMaxDate()}
      placeholder="Choisissez une date pour votre rendez-vous"
    />
  );
}
```

#### Visual Design
- **Input Field**: Clean, modern input with calendar icon
- **Calendar Grid**: 7-column grid with proper spacing
- **Color Scheme**: 
  - Primary pink for selected dates
  - Soft pink for today's date
  - Gray tones for disabled and other dates
- **Hover Effects**: Smooth transitions on interactive elements
- **Shadow & Borders**: Subtle shadows and borders for depth

### 2. TimePicker Component

A grid-based time picker that displays available time slots with real-time availability checking.

#### Features
- **Time Slot Grid**: 3-column grid layout for easy selection
- **Availability Integration**: Shows only available time slots
- **Loading States**: Spinner during availability checking
- **Visual Feedback**: 
  - Available slots with hover effects
  - Selected time with primary pink background
  - Unavailable slots with disabled styling
- **Dynamic Content**: Adapts to available slots vs. all slots
- **Clear Function**: X button to clear selected time
- **Accessibility**: Keyboard navigation and screen reader support

#### Props
```typescript
interface TimePickerProps {
  value: string;                    // Current selected time (HH:MM format)
  onChange: (time: string) => void; // Callback when time is selected
  availableSlots?: string[];        // Array of available time slots
  isLoading?: boolean;              // Show loading state
  placeholder?: string;             // Input placeholder text
  className?: string;               // Additional CSS classes
  disabled?: boolean;               // Disable the picker
}
```

#### Usage Example
```tsx
import TimePicker from '../components/TimePicker';

function AppointmentForm() {
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  return (
    <TimePicker
      value={selectedTime}
      onChange={setSelectedTime}
      availableSlots={availableSlots}
      isLoading={isLoadingSlots}
      placeholder="Choisissez une heure pour votre rendez-vous"
    />
  );
}
```

#### Business Logic Integration
- **Business Hours**: 9 AM to 7 PM (configurable)
- **Time Intervals**: 30-minute slots
- **Availability Checking**: Real-time integration with appointment database
- **Conflict Detection**: Prevents double-booking

## Integration in Appointment Booking

### Current Implementation

The date and time pickers are fully integrated into the appointment booking flow:

1. **Step 2 - Date & Time Selection**:
   - DatePicker for selecting appointment date
   - TimePicker for selecting appointment time
   - Real-time availability checking
   - Automatic slot generation based on business hours

2. **User Experience Flow**:
   - User selects a date → TimePicker shows available slots
   - User selects a time → Proceeds to customer information
   - Clear visual feedback at each step

### Code Integration

```tsx
// In app/rendez-vous/page.tsx

// Date Selection
<DatePicker
  value={selectedDate}
  onChange={handleDateSelection}
  minDate={getMinDate()}
  maxDate={getMaxDate()}
  placeholder="Choisissez une date pour votre rendez-vous"
/>

// Time Selection
<TimePicker
  value={selectedTime}
  onChange={handleTimeSelection}
  availableSlots={availableSlots}
  isLoading={isLoadingSlots}
  placeholder="Choisissez une heure pour votre rendez-vous"
/>
```

## Styling & Theming

### Color Scheme
- **Primary Pink**: `#FF69B4` - Selected states and highlights
- **Soft Pink**: `#FFE4E1` - Hover states and today's date
- **Gray Scale**: Various gray tones for text, borders, and disabled states

### CSS Classes
The components use Tailwind CSS classes and custom CSS variables:
- Responsive design with mobile-first approach
- Consistent spacing and typography
- Smooth transitions and animations
- Focus states for accessibility

### Customization
Both components accept `className` props for additional styling:
```tsx
<DatePicker
  className="w-full md:w-64"
  // ... other props
/>
```

## Accessibility Features

### Keyboard Navigation
- **Escape Key**: Closes picker dropdown
- **Tab Navigation**: Proper focus management
- **Enter/Space**: Select dates and times

### Screen Reader Support
- Proper ARIA labels and descriptions
- Semantic HTML structure
- Clear state announcements

### Visual Accessibility
- High contrast color combinations
- Clear visual indicators for states
- Adequate touch targets for mobile

## Performance Considerations

### Optimization
- **Event Listeners**: Proper cleanup on component unmount
- **State Management**: Efficient state updates
- **Rendering**: Minimal re-renders with proper dependencies

### Memory Management
- **Refs**: Used for click-outside detection
- **Event Cleanup**: Proper removal of event listeners
- **State Cleanup**: Clear state when components unmount

## Browser Compatibility

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Support
- iOS Safari
- Chrome Mobile
- Responsive design for all screen sizes

## Future Enhancements

### Potential Improvements
1. **Week View**: Show entire week for easier navigation
2. **Month View**: Quick month selection
3. **Time Range**: Allow time range selection
4. **Custom Intervals**: Configurable time slot intervals
5. **Multiple Selection**: Allow multiple date/time selections
6. **Calendar Integration**: Sync with external calendars

### Advanced Features
1. **Recurring Appointments**: Weekly/monthly recurring slots
2. **Staff Scheduling**: Multiple staff member availability
3. **Service Duration**: Dynamic time slots based on service duration
4. **Holiday Calendar**: Automatic holiday detection and blocking

## Troubleshooting

### Common Issues

1. **Date Format Issues**
   - Ensure dates are in YYYY-MM-DD format
   - Check timezone handling for date comparisons

2. **Time Slot Availability**
   - Verify availableSlots array format (HH:MM)
   - Check loading state management

3. **Styling Conflicts**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

### Debug Tips
- Use browser dev tools to inspect component state
- Check console for any error messages
- Verify prop types and data formats
- Test on different screen sizes and browsers

## Conclusion

The DatePicker and TimePicker components provide a modern, user-friendly interface for appointment scheduling. They are fully integrated with the Queen&apos;s Glam booking system and offer:

- ✅ Beautiful, intuitive design
- ✅ Full accessibility support
- ✅ Mobile-responsive layout
- ✅ Real-time availability integration
- ✅ French localization
- ✅ Business logic enforcement
- ✅ Performance optimization

These components significantly enhance the user experience of the appointment booking system while maintaining consistency with the overall design language. 