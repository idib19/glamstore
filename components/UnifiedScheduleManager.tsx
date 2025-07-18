'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { timeSlotsApi } from '../lib/supabase'
import { Calendar, Clock } from 'lucide-react'

interface UnifiedScheduleManagerProps {
  onScheduleUpdated?: () => void
}

interface DaySchedule {
  isOpen: boolean
  startTime: string
  endTime: string
}

interface WeeklySchedule {
  effectiveFrom: string
  effectiveUntil: string
  days: Record<string, DaySchedule>
}

const dayLabels = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche'
}

export default function UnifiedScheduleManager({ onScheduleUpdated }: UnifiedScheduleManagerProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    effectiveFrom: '',
    effectiveUntil: '',
    days: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize default schedule
  const defaultDaySchedule: DaySchedule = useMemo(() => ({
    isOpen: false,
    startTime: '09:00',
    endTime: '18:00'
  }), [])

  const loadSchedule = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Initialize default schedule
      const defaultSchedule: WeeklySchedule = {
        effectiveFrom: new Date().toISOString().split('T')[0],
        effectiveUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        days: {}
      }

      // Initialize each day with default values
      Object.keys(dayLabels).forEach(day => {
        defaultSchedule.days[day] = { ...defaultDaySchedule }
      })

      // Try to load existing schedule from database
      try {
        const data = await timeSlotsApi.getByDayOrganized()
        
        // Convert time slots to schedule format
        Object.keys(dayLabels).forEach(day => {
          const daySlots = data[day] || []
          
          if (daySlots.length > 0) {
            // Find regular slots (available slots)
            const regularSlots = daySlots.filter((slot: { is_available: boolean; slot_type: string }) => 
              slot.is_available && slot.slot_type === 'regular'
            )
            
            if (regularSlots.length > 0) {
              const firstSlot = regularSlots[0]
              const lastSlot = regularSlots[regularSlots.length - 1]
              
              defaultSchedule.days[day] = {
                isOpen: true,
                startTime: firstSlot.start_time,
                endTime: lastSlot.end_time
              }
            } else {
              defaultSchedule.days[day] = { ...defaultDaySchedule, isOpen: false }
            }
          } else {
            defaultSchedule.days[day] = { ...defaultDaySchedule, isOpen: false }
          }
        })
      } catch {
        console.log('No existing schedule found, using defaults')
      }

      setSchedule(defaultSchedule)
    } catch (error) {
      console.error('Error loading schedule:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des horaires' })
    } finally {
      setIsLoading(false)
    }
  }, [defaultDaySchedule])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  const handleDayChange = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setSchedule(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [field]: value
        }
      }
    }))
  }

  const handleDateChange = (field: 'effectiveFrom' | 'effectiveUntil', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setMessage(null)

      // Validate date range
      if (schedule.effectiveFrom >= schedule.effectiveUntil) {
        setMessage({ type: 'error', text: 'La date de fin doit être après la date de début' })
        return
      }

      // Convert schedule to time slots and save to database
      for (const [day, daySchedule] of Object.entries(schedule.days)) {
        const slots = []
        
        if (daySchedule.isOpen) {
          // Add single slot for the day
          slots.push({
            start_time: daySchedule.startTime,
            end_time: daySchedule.endTime,
            is_available: true,
            slot_type: 'regular' as const,
            notes: 'Horaires d\'ouverture'
          })
        }
        
        // Save slots for this day
        await timeSlotsApi.bulkCreate(day, slots)
      }

             // Save date range to store_data table
       await timeSlotsApi.saveScheduleDateRange(schedule.effectiveFrom, schedule.effectiveUntil)

      setMessage({ type: 'success', text: 'Horaires sauvegardés avec succès !' })
      onScheduleUpdated?.()
    } catch (error) {
      console.error('Error saving schedule:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des horaires' })
    } finally {
      setIsSaving(false)
    }
  }

  const setStandardWeek = () => {
    const standardSchedule: DaySchedule = {
      isOpen: true,
      startTime: '09:00',
      endTime: '18:00'
    }
    
    const weekendSchedule: DaySchedule = {
      isOpen: true,
      startTime: '10:00',
      endTime: '17:00'
    }
    
    const newSchedule = { ...schedule }
    Object.keys(dayLabels).forEach(day => {
      if (day === 'saturday' || day === 'sunday') {
        newSchedule.days[day] = { ...weekendSchedule }
      } else {
        newSchedule.days[day] = { ...standardSchedule }
      }
    })
    setSchedule(newSchedule)
  }

  const setClosedWeek = () => {
    const closedSchedule: DaySchedule = {
      isOpen: false,
      startTime: '09:00',
      endTime: '18:00'
    }
    
    const newSchedule = { ...schedule }
    Object.keys(dayLabels).forEach(day => {
      newSchedule.days[day] = { ...closedSchedule }
    })
    setSchedule(newSchedule)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Configuration des horaires</h3>
        <p className="mt-1 text-sm text-gray-500">
          Définissez vos horaires d&apos;ouverture et la période d&apos;application
        </p>
      </div>

      {message && (
        <div className={`mx-6 mt-4 p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="p-6">
        {/* Date Range Selection */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Période d&apos;application
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                À partir du
              </label>
              <input
                type="date"
                value={schedule.effectiveFrom}
                onChange={(e) => handleDateChange('effectiveFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jusqu&apos;au
              </label>
              <input
                type="date"
                value={schedule.effectiveUntil}
                onChange={(e) => handleDateChange('effectiveUntil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Actions rapides
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={setStandardWeek}
              disabled={isSaving}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              Semaine standard
            </button>
            <button
              onClick={setClosedWeek}
              disabled={isSaving}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50"
            >
              Fermé toute la semaine
            </button>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Horaires quotidiens
          </h4>
          <div className="space-y-4">
            {Object.entries(dayLabels).map(([day, label]) => {
              const daySchedule = schedule.days[day] || defaultDaySchedule
              
              return (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-md font-medium text-gray-900">{label}</h5>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={daySchedule.isOpen}
                        onChange={(e) => handleDayChange(day, 'isOpen', e.target.checked)}
                        className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Ouvert</span>
                    </label>
                  </div>

                  {daySchedule.isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heure d&apos;ouverture
                        </label>
                        <input
                          type="time"
                          value={daySchedule.startTime}
                          onChange={(e) => handleDayChange(day, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heure de fermeture
                        </label>
                        <input
                          type="time"
                          value={daySchedule.endTime}
                          onChange={(e) => handleDayChange(day, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {!daySchedule.isOpen && (
                    <div className="text-center py-4 text-gray-500">
                      <p>Fermé ce jour</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-pink rounded-md hover:bg-pink-600 disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les horaires'}
          </button>
        </div>
      </div>
    </div>
  )
} 