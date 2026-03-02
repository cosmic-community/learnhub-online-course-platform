'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  day: string
  active: boolean
  today: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get or initialize streak data from localStorage
    const storedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()
    
    let currentStreak = storedStreak ? parseInt(storedStreak) : 0
    
    if (lastVisit !== today) {
      // New day visit
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day
        currentStreak += 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else if (lastVisit) {
        // Streak broken
        currentStreak = 1
      } else {
        // First visit
        currentStreak = 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      localStorage.setItem('learning-streak', currentStreak.toString())
      localStorage.setItem('last-visit-date', today)
    }
    
    setStreak(currentStreak)
    
    // Generate week days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const todayIndex = new Date().getDay()
    const visitedDays = JSON.parse(localStorage.getItem('visited-days') || '[]')
    
    // Add today to visited days
    if (!visitedDays.includes(todayIndex)) {
      visitedDays.push(todayIndex)
      localStorage.setItem('visited-days', JSON.stringify(visitedDays))
    }
    
    const weekData = days.map((day, index) => ({
      day,
      active: visitedDays.includes(index),
      today: index === todayIndex
    }))
    
    setWeekDays(weekData)
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-800 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-navy-800 rounded mb-4"></div>
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 w-12 bg-navy-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="celebration-particle celebration-1">🎉</div>
          <div className="celebration-particle celebration-2">⭐</div>
          <div className="celebration-particle celebration-3">🔥</div>
          <div className="celebration-particle celebration-4">✨</div>
          <div className="celebration-particle celebration-5">🎊</div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Learning Streak
        </h3>
        {streak >= 7 && (
          <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1">
            On Fire! 🔥
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tabular-nums">
          {streak}
        </div>
        <div>
          <div className="text-white font-medium">
            {streak === 1 ? 'Day' : 'Days'} Streak
          </div>
          <div className="text-navy-400 text-sm">
            {streak >= 7 ? "You're on fire! Keep it up!" : 
             streak >= 3 ? "Great progress! Keep going!" : 
             "Start building your streak!"}
          </div>
        </div>
      </div>
      
      {/* Week visualization */}
      <div className="flex gap-2 justify-between">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                day.active
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 scale-110'
                  : day.today
                  ? 'bg-navy-700 text-navy-300 ring-2 ring-primary-500/50'
                  : 'bg-navy-800 text-navy-500'
              }`}
            >
              {day.active ? '✓' : day.today ? '•' : ''}
            </div>
            <span className={`text-xs ${day.today ? 'text-primary-400 font-medium' : 'text-navy-500'}`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Streak milestones */}
      <div className="mt-6 pt-4 border-t border-navy-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-navy-400">Next milestone:</span>
          <span className="text-white font-medium">
            {streak < 7 ? `${7 - streak} days to 🏆 Weekly Champion` :
             streak < 30 ? `${30 - streak} days to 🥇 Monthly Master` :
             `${100 - streak} days to 💎 Century Legend`}
          </span>
        </div>
        <div className="mt-2 h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(100, (streak / (streak < 7 ? 7 : streak < 30 ? 30 : 100)) * 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}