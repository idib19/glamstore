'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, X } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  availableSlots?: string[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function TimePicker({
  value,
  onChange,
  availableSlots = [],
  isLoading = false,
  placeholder = "Sélectionner une heure",
  className = "",
  disabled = false
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Initialize selected time from value prop
  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close picker on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const formatTime = (time: string): string => {
    return time;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onChange(time);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedTime('');
    onChange('');
  };

  // Generate time slots if none provided
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = availableSlots.length > 0 ? availableSlots : generateTimeSlots();

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={selectedTime ? formatTime(selectedTime) : ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {selectedTime && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Time Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px] max-h-64 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">
              Créneaux disponibles
            </h3>
            {availableSlots.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {availableSlots.length} créneau{availableSlots.length > 1 ? 'x' : ''} disponible{availableSlots.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Time Slots Grid */}
          <div className="p-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-pink"></div>
                <span className="ml-2 text-sm text-gray-600">Chargement...</span>
              </div>
            ) : timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {timeSlots.map((time) => {
                  const isAvailable = availableSlots.length === 0 || availableSlots.includes(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => isAvailable && handleTimeSelect(time)}
                      disabled={!isAvailable}
                      className={`
                        px-3 py-2 text-sm border rounded-md transition-all font-medium
                        ${isSelected
                          ? 'bg-primary-pink text-white border-primary-pink shadow-md'
                          : isAvailable
                          ? 'border-gray-300 text-gray-900 hover:border-primary-pink hover:bg-soft-pink'
                          : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucun créneau disponible</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary-pink"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span>Indisponible</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 