'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  date: string
  completed: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [lastSevenDays, setLastSevenDays] = useState<StreakDay[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Generate last 7 days for display
    const days: StreakDay[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Check localStorage for completed days (simulated learning activity)
      const completed = typeof window !== 'undefined' 
        ? localStorage.getItem(`learning-${dateStr}`) === 'true' || i > 3 // Demo: last 3+ days completed
        : false
        
      days.push({ date: dateStr, completed })
    }
    
    setLastSevenDays(days)
    
    // Calculate current streak
    let currentStreak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].completed) {
        currentStreak++
      } else {
        break
      }
    }
    setStreak(currentStreak)
    
    // Mark today as a learning day (for demo purposes)
    const todayStr = today.toISOString().split('T')[0]
    if (typeof window !== 'undefined') {
      localStorage.setItem(`learning-${todayStr}`, 'true')
    }
  }, [])

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[date.getDay()]
  }

  if (!mounted) return null

  return (
    <div className="bg-navy-900/50 border border-navy-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Learning Streak
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary-400">{streak}</span>
          <span className="text-navy-400 text-sm">days</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-2">
        {lastSevenDays.map((day, index) => (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                day.completed 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                  : 'bg-navy-800 text-navy-500'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {day.completed ? '✓' : getDayLabel(day.date)}
            </div>
            <span className="text-xs text-navy-500">{getDayLabel(day.date)}</span>
          </div>
        ))}
      </div>
      
      {streak >= 3 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-primary-400 animate-pulse">
            🎉 Amazing! Keep the momentum going!
          </span>
        </div>
      )}
    </div>
  )
}