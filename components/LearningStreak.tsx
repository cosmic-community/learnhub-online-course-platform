'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  todayCompleted: boolean
  totalLessonsCompleted: number
}

const STREAK_KEY = 'learnhub_streak_data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLearningDate: null,
      todayCompleted: false,
      totalLessonsCompleted: 0,
    }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid data, return default
    }
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    todayCompleted: false,
    totalLessonsCompleted: 0,
  }
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(getStreakData)
  
  useEffect(() => {
    const data = getStreakData()
    const today = getDateString(new Date())
    const yesterday = getDateString(new Date(Date.now() - 86400000))
    
    // Check if streak should be reset
    if (data.lastLearningDate && data.lastLearningDate !== today && data.lastLearningDate !== yesterday) {
      data.currentStreak = 0
      data.todayCompleted = false
    } else if (data.lastLearningDate === today) {
      data.todayCompleted = true
    } else {
      data.todayCompleted = false
    }
    
    setStreakData(data)
  }, [])
  
  const recordLearning = () => {
    const today = getDateString(new Date())
    const data = getStreakData()
    
    if (data.lastLearningDate !== today) {
      const yesterday = getDateString(new Date(Date.now() - 86400000))
      
      if (data.lastLearningDate === yesterday) {
        data.currentStreak += 1
      } else if (data.lastLearningDate !== today) {
        data.currentStreak = 1
      }
      
      data.lastLearningDate = today
      data.todayCompleted = true
      data.totalLessonsCompleted += 1
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      localStorage.setItem(STREAK_KEY, JSON.stringify(data))
      setStreakData({ ...data })
      
      return true // New learning recorded
    }
    
    // Already learned today, just increment lessons
    data.totalLessonsCompleted += 1
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    setStreakData({ ...data })
    
    return false
  }
  
  return { streakData, recordLearning }
}

export default function LearningStreak() {
  const { streakData } = useStreak()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded"></div>
      </div>
    )
  }
  
  const flames = Array.from({ length: Math.min(streakData.currentStreak, 7) }, (_, i) => i)
  
  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/5 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Learning Streak
          </h3>
          {streakData.todayCompleted && (
            <span className="badge bg-green-500/20 text-green-400 text-xs">
              ✓ Today
            </span>
          )}
        </div>
        
        <div className="flex items-end gap-1 mb-4 h-12">
          {flames.length > 0 ? (
            flames.map((_, i) => (
              <div
                key={i}
                className="flex-1 max-w-8 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t-full animate-pulse"
                style={{
                  height: `${40 + (i * 8)}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))
          ) : (
            <p className="text-navy-400 text-sm">Start learning to build your streak!</p>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-400">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-400">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">{streakData.totalLessonsCompleted}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
        </div>
        
        {!streakData.todayCompleted && (
          <p className="mt-4 text-sm text-navy-300 text-center">
            Complete a lesson today to {streakData.currentStreak > 0 ? 'keep' : 'start'} your streak! 💪
          </p>
        )}
      </div>
    </div>
  )
}