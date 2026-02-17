'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  weeklyActivity: boolean[]
}

const STORAGE_KEY = 'learnhub_streak'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalDaysLearned: 0,
      weeklyActivity: [false, false, false, false, false, false, false]
    }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDaysLearned: 0,
    weeklyActivity: [false, false, false, false, false, false, false]
  }
}

function updateStreak(data: StreakData): StreakData {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  if (data.lastVisit === today) {
    return data // Already visited today
  }
  
  const newData = { ...data }
  const dayOfWeek = new Date().getDay()
  
  // Update weekly activity (shift and add today)
  if (data.lastVisit !== yesterday && data.lastVisit !== today && data.lastVisit !== '') {
    // Streak broken - reset
    newData.currentStreak = 1
    newData.weeklyActivity = [false, false, false, false, false, false, false]
  } else if (data.lastVisit === yesterday) {
    // Continued streak
    newData.currentStreak = data.currentStreak + 1
  } else {
    // First visit
    newData.currentStreak = 1
  }
  
  newData.weeklyActivity[dayOfWeek] = true
  newData.lastVisit = today
  newData.totalDaysLearned = data.totalDaysLearned + 1
  newData.longestStreak = Math.max(newData.longestStreak, newData.currentStreak)
  
  return newData
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const data = getStreakData()
    const updated = updateStreak(data)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
    
    setStreakData(updated)
    
    // Trigger animation if streak increased
    if (updated.currentStreak > data.currentStreak) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded"></div>
      </div>
    )
  }

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Animated fire background for high streaks */}
      {streakData.currentStreak >= 7 && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent pointer-events-none" />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`text-4xl ${isAnimating ? 'animate-bounce' : ''}`}>
              {streakData.currentStreak >= 30 ? '🔥' : 
               streakData.currentStreak >= 7 ? '⚡' : 
               streakData.currentStreak >= 3 ? '✨' : '📚'}
            </span>
            <div>
              <div className="text-3xl font-bold text-white">
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 text-sm">day streak</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-primary-400">
              {streakData.longestStreak} 🏆
            </div>
            <div className="text-navy-400 text-xs">best streak</div>
          </div>
        </div>

        {/* Weekly activity */}
        <div className="flex items-center justify-between gap-2 mt-4">
          {dayNames.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs text-navy-500">{day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                  index === today
                    ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900'
                    : streakData.weeklyActivity[index]
                    ? 'bg-primary-500/30 text-primary-400'
                    : 'bg-navy-800 text-navy-600'
                }`}
              >
                {streakData.weeklyActivity[index] ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Motivational message */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <p className="text-sm text-navy-300 text-center">
            {streakData.currentStreak === 0 && "Start your learning journey today! 🚀"}
            {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! 💪"}
            {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && `${7 - streakData.currentStreak} more days until your first week! 📅`}
            {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "You're on fire! Keep the momentum going! 🔥"}
            {streakData.currentStreak >= 30 && "Legendary learner! You're absolutely crushing it! 👑"}
          </p>
        </div>
      </div>
    </div>
  )
}