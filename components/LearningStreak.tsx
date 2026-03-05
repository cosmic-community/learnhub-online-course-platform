'use client'

import { useEffect, useState } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalDaysLearned: number
}

const STORAGE_KEY = 'learnhub_streak_data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastLearningDate: null, totalDaysLearned: 0 }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { currentStreak: 0, longestStreak: 0, lastLearningDate: null, totalDaysLearned: 0 }
}

function saveStreakData(data: StreakData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isYesterday(dateString: string): boolean {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export function recordLearningActivity(): void {
  const data = getStreakData()
  const today = new Date().toISOString()
  
  if (data.lastLearningDate && isToday(data.lastLearningDate)) {
    // Already recorded today
    return
  }
  
  if (data.lastLearningDate && isYesterday(data.lastLearningDate)) {
    // Continuing streak
    data.currentStreak += 1
  } else if (!data.lastLearningDate || !isToday(data.lastLearningDate)) {
    // Starting new streak
    data.currentStreak = 1
  }
  
  data.lastLearningDate = today
  data.totalDaysLearned += 1
  
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak
  }
  
  saveStreakData(data)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    totalDaysLearned: 0
  })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const data = getStreakData()
    
    // Check if streak should be reset (missed a day)
    if (data.lastLearningDate && !isToday(data.lastLearningDate) && !isYesterday(data.lastLearningDate)) {
      data.currentStreak = 0
      saveStreakData(data)
    }
    
    setStreakData(data)
    
    // Animate if there's an active streak
    if (data.currentStreak > 0) {
      const timer = setTimeout(() => setIsAnimating(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const flames = Array.from({ length: Math.min(streakData.currentStreak, 7) })

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        {/* Fire Animation */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className={`text-4xl transition-transform duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
            🔥
          </div>
          {streakData.currentStreak >= 7 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
              ⭐
            </div>
          )}
        </div>
        
        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {streakData.currentStreak}
            </span>
            <span className="text-navy-400 text-sm">
              {streakData.currentStreak === 1 ? 'day' : 'days'} streak
            </span>
          </div>
          <div className="text-sm text-navy-400 mt-1">
            {streakData.currentStreak === 0 ? (
              'Start learning to build your streak!'
            ) : streakData.currentStreak >= 7 ? (
              <span className="text-yellow-400">🌟 Amazing! You&apos;re on fire!</span>
            ) : streakData.currentStreak >= 3 ? (
              <span className="text-primary-400">Keep it going! You&apos;re doing great!</span>
            ) : (
              'Nice start! Keep the momentum!'
            )}
          </div>
        </div>
      </div>

      {/* Flame Trail */}
      {streakData.currentStreak > 0 && (
        <div className="mt-4 flex items-center gap-1">
          {flames.map((_, index) => (
            <div
              key={index}
              className="text-xl transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'scale(1)' : 'scale(0)',
                transition: `all 0.3s ease ${index * 0.1}s`
              }}
            >
              🔥
            </div>
          ))}
          {streakData.currentStreak > 7 && (
            <span className="text-sm text-navy-400 ml-2">+{streakData.currentStreak - 7}</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-navy-800 grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Longest Streak</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{streakData.totalDaysLearned}</div>
          <div className="text-xs text-navy-400">Total Days</div>
        </div>
      </div>
    </div>
  )
}