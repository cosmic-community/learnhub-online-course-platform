'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
}

const STREAK_KEY = 'learnhub_streak_data'

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDaysLearned: 0 }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDaysLearned: 0 }
  }
  
  try {
    return JSON.parse(stored) as StreakData
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDaysLearned: 0 }
  }
}

function updateStreak(): StreakData {
  const today = new Date().toDateString()
  const stored = getStoredStreak()
  
  if (stored.lastVisit === today) {
    return stored
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak: StreakData
  
  if (stored.lastVisit === yesterdayStr) {
    // Continuing streak
    newStreak = {
      currentStreak: stored.currentStreak + 1,
      longestStreak: Math.max(stored.longestStreak, stored.currentStreak + 1),
      lastVisit: today,
      totalDaysLearned: stored.totalDaysLearned + 1
    }
  } else if (stored.lastVisit === '') {
    // First visit
    newStreak = {
      currentStreak: 1,
      longestStreak: 1,
      lastVisit: today,
      totalDaysLearned: 1
    }
  } else {
    // Streak broken
    newStreak = {
      currentStreak: 1,
      longestStreak: stored.longestStreak,
      lastVisit: today,
      totalDaysLearned: stored.totalDaysLearned + 1
    }
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak))
  return newStreak
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    const oldStreak = getStoredStreak()
    const newStreak = updateStreak()
    setStreak(newStreak)
    
    // Check if streak increased
    if (newStreak.currentStreak > oldStreak.currentStreak && oldStreak.currentStreak > 0) {
      setIsNewStreak(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streak) {
    return null
  }

  const getStreakEmoji = (days: number): string => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '💎'
    if (days >= 7) return '🔥'
    if (days >= 3) return '⚡'
    return '✨'
  }

  const getStreakMessage = (days: number): string => {
    if (days >= 30) return 'Legendary learner!'
    if (days >= 14) return 'Two weeks strong!'
    if (days >= 7) return 'On fire!'
    if (days >= 3) return 'Building momentum!'
    if (days === 1) return 'Great start!'
    return 'Keep going!'
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-ping"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              >
                ✨
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`card p-6 text-center transition-all duration-500 ${isNewStreak ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''}`}>
        {/* Streak Fire Animation */}
        <div className="relative inline-block mb-4">
          <span className={`text-5xl ${streak.currentStreak >= 3 ? 'animate-bounce' : ''}`}>
            {getStreakEmoji(streak.currentStreak)}
          </span>
          {streak.currentStreak >= 7 && (
            <span className="absolute -top-1 -right-1 text-xl animate-pulse">
              🔥
            </span>
          )}
        </div>

        <div className="text-4xl font-bold text-white mb-1">
          {streak.currentStreak}
        </div>
        <div className="text-navy-400 text-sm mb-3">
          day{streak.currentStreak !== 1 ? 's' : ''} streak
        </div>
        
        <div className="text-primary-400 font-medium text-sm mb-4">
          {getStreakMessage(streak.currentStreak)}
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-6 pt-4 border-t border-navy-800">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streak.longestStreak}</div>
            <div className="text-xs text-navy-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streak.totalDaysLearned}</div>
            <div className="text-xs text-navy-500">Total Days</div>
          </div>
        </div>
      </div>
    </div>
  )
}