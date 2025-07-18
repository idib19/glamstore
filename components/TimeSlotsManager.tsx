'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { timeSlotsApi } from '../lib/supabase'
import { TimeSlot } from '../types/database'

interface TimeSlotsManagerProps {
  onTimeSlotsUpdated?: () => void
}

interface DaySchedule {
  isOpen: boolean
  startTime: string
  endTime: string
  hasUnavailableSlot: boolean
  unavailableStart: string
  unavailableEnd: string
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

export default function TimeSlotsManager({ onTimeSlotsUpdated }: TimeSlotsManagerProps) {
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DaySchedule>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize default schedule
  const defaultSchedule: DaySchedule = useMemo(() => ({
    isOpen: false,
    startTime: '09:00',
    endTime: '18:00',
    hasUnavailableSlot: false,
    unavailableStart: '12:00',
    unavailableEnd: '13:00'
  }), [])

  const loadTimeSlots = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await timeSlotsApi.getByDayOrganized()
      
      // Convert time slots to weekly schedule format
      const schedule: Record<string, DaySchedule> = {}
      
      Object.keys(dayLabels).forEach(day => {
        const daySlots = data[day] || []
        
        if (daySlots.length === 0) {
          schedule[day] = { ...defaultSchedule, isOpen: false }
        } else {
          // Find regular slots (available slots)
          const regularSlots = daySlots.filter((slot: TimeSlot) => 
            slot.is_available && slot.slot_type === 'regular'
          )
          
          // Find unavailable slot (formerly lunch break)
          const unavailableSlot = daySlots.find((slot: TimeSlot) => 
            !slot.is_available && slot.slot_type === 'lunch'
          )
          
          if (regularSlots.length > 0) {
            const firstSlot = regularSlots[0]
            const lastSlot = regularSlots[regularSlots.length - 1]
            
            schedule[day] = {
              isOpen: true,
              startTime: firstSlot.start_time,
              endTime: lastSlot.end_time,
              hasUnavailableSlot: !!unavailableSlot,
              unavailableStart: unavailableSlot?.start_time || '12:00',
              unavailableEnd: unavailableSlot?.end_time || '13:00'
            }
          } else {
            schedule[day] = { ...defaultSchedule, isOpen: false }
          }
        }
      })
      
      setWeeklySchedule(schedule)
    } catch (error) {
      console.error('Error loading time slots:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des horaires' })
    } finally {
      setIsLoading(false)
    }
  }, [defaultSchedule])

  useEffect(() => {
    loadTimeSlots()
  }, [loadTimeSlots])

  const handleDayChange = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setMessage(null)

      // Convert weekly schedule back to time slots
      for (const [day, schedule] of Object.entries(weeklySchedule)) {
        const slots = []
        
        if (schedule.isOpen) {
          // Add morning slot
          if (schedule.hasUnavailableSlot && schedule.startTime < schedule.unavailableStart) {
            slots.push({
              start_time: schedule.startTime,
              end_time: schedule.unavailableStart,
              is_available: true,
              slot_type: 'regular' as const,
              notes: 'Matin'
            })
          } else {
            slots.push({
              start_time: schedule.startTime,
              end_time: schedule.endTime,
              is_available: true,
              slot_type: 'regular' as const,
              notes: 'Ouverture'
            })
          }
          
          // Add unavailable slot if enabled
          if (schedule.hasUnavailableSlot) {
            slots.push({
              start_time: schedule.unavailableStart,
              end_time: schedule.unavailableEnd,
              is_available: false,
              slot_type: 'lunch' as const,
              notes: 'Créneau indisponible'
            })
            
            // Add afternoon slot
            if (schedule.unavailableEnd < schedule.endTime) {
              slots.push({
                start_time: schedule.unavailableEnd,
                end_time: schedule.endTime,
                is_available: true,
                slot_type: 'regular' as const,
                notes: 'Après-midi'
              })
            }
          }
        }
        
        // Save slots for this day
        await timeSlotsApi.bulkCreate(day, slots)
      }

      setMessage({ type: 'success', text: 'Horaires sauvegardés avec succès !' })
      onTimeSlotsUpdated?.()
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
      endTime: '18:00',
      hasUnavailableSlot: true,
      unavailableStart: '12:00',
      unavailableEnd: '13:00'
    }
    
    const weekendSchedule: DaySchedule = {
      isOpen: true,
      startTime: '10:00',
      endTime: '17:00',
      hasUnavailableSlot: false,
      unavailableStart: '12:00',
      unavailableEnd: '13:00'
    }
    
    const newSchedule: Record<string, DaySchedule> = {}
    Object.keys(dayLabels).forEach(day => {
      if (day === 'saturday' || day === 'sunday') {
        newSchedule[day] = { ...weekendSchedule }
      } else {
        newSchedule[day] = { ...standardSchedule }
      }
    })
    setWeeklySchedule(newSchedule)
  }

  const setClosedWeek = () => {
    const closedSchedule: DaySchedule = {
      isOpen: false,
      startTime: '09:00',
      endTime: '18:00',
      hasUnavailableSlot: false,
      unavailableStart: '12:00',
      unavailableEnd: '13:00'
    }
    
    const newSchedule: Record<string, DaySchedule> = {}
    Object.keys(dayLabels).forEach(day => {
      newSchedule[day] = { ...closedSchedule }
    })
    setWeeklySchedule(newSchedule)
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
        <h3 className="text-lg font-medium text-gray-900">Horaires hebdomadaires</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configurez les horaires d&apos;ouverture pour chaque jour de la semaine
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
        {/* Quick Actions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Actions rapides
          </label>
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

        {/* Weekly Schedule */}
        <div className="space-y-4">
          {Object.entries(dayLabels).map(([day, label]) => {
            const schedule = weeklySchedule[day] || defaultSchedule
            
            return (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">{label}</h4>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.isOpen}
                      onChange={(e) => handleDayChange(day, 'isOpen', e.target.checked)}
                      className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ouvert</span>
                  </label>
                </div>

                {schedule.isOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Opening Hours */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disponible de
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleDayChange(day, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disponible jusqu&apos;à
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleDayChange(day, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                      />
                    </div>

                    {/* Unavailable Time Slot */}
                    <div className="md:col-span-2">
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={schedule.hasUnavailableSlot}
                          onChange={(e) => handleDayChange(day, 'hasUnavailableSlot', e.target.checked)}
                          className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Créneau indisponible</span>
                      </label>
                      
                      {schedule.hasUnavailableSlot && (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="time"
                            value={schedule.unavailableStart}
                            onChange={(e) => handleDayChange(day, 'unavailableStart', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                            placeholder="Début"
                          />
                          <input
                            type="time"
                            value={schedule.unavailableEnd}
                            onChange={(e) => handleDayChange(day, 'unavailableEnd', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                            placeholder="Fin"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!schedule.isOpen && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Fermé ce jour</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
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