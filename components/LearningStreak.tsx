'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const STREAK_KEY = 'learnhub-learning-streak'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
  
  try {
    return JSON.parse(stored) as StreakData
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
}

function updateStreak(): StreakData {
  const data = getStreakData()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  // If already visited today, don't update
  if (data.lastVisit === today) {
    return data
  }
  
  let newStreak = data.currentStreak
  
  if (data.lastVisit === yesterday) {
    // Continue the streak
    newStreak = data.currentStreak + 1
  } else if (data.lastVisit !== today) {
    // Streak broken or first visit
    newStreak = 1
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastVisit: today,
    totalVisits: data.totalVisits + 1
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '💎'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '⭐'
  return '✨'
}

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Legendary learner!'
  if (streak >= 14) return 'Two weeks strong!'
  if (streak >= 7) return "You're on fire!"
  if (streak >= 3) return 'Building momentum!'
  if (streak === 1) return 'Great start!'
  return 'Welcome back!'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const previousData = getStreakData()
    const newData = updateStreak()
    setStreakData(newData)
    
    // Check if streak increased
    if (newData.currentStreak > previousData.currentStreak && previousData.currentStreak > 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!streakData) return null

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = 6 - i
    const date = new Date(Date.now() - dayOffset * 86400000)
    const dateStr = date.toDateString()
    const isToday = dayOffset === 0
    const isPast = dayOffset > 0
    
    // Simple check: if within current streak, it's active
    const isActive = dayOffset < streakData.currentStreak
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      isActive: isActive || (isToday && streakData.lastVisit === dateStr),
      isToday,
      isPast
    }
  })

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>
      )}
      
      <div className={`card p-6 transition-all duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`text-3xl transition-transform duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
              {getStreakEmoji(streakData.currentStreak)}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              <p className="text-sm text-navy-400">{getStreakMessage(streakData.currentStreak)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold text-primary-400 transition-all duration-500 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-500">day{streakData.currentStreak !== 1 ? 's' : ''}</div>
          </div>
        </div>
        
        {/* Week Progress */}
        <div className="flex justify-between gap-1 mb-4">
          {streakDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  day.isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : day.isToday 
                      ? 'bg-navy-700 text-navy-300 ring-2 ring-primary-500/50'
                      : 'bg-navy-800 text-navy-500'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {day.isActive ? '✓' : day.day}
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex justify-between text-center pt-4 border-t border-navy-800">
          <div>
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-500">Best Streak</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-500">Total Visits</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {Math.round((streakData.currentStreak / 30) * 100)}%
            </div>
            <div className="text-xs text-navy-500">To 30 Days</div>
          </div>
        </div>
      </div>
    </div>
  )
}