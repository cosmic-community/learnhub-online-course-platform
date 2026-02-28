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
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
    }
  }
  return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
}

function updateStreak(): StreakData {
  const data = getStreakData()
  const today = new Date().toDateString()
  const lastVisit = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
  
  if (lastVisit === today) {
    // Already visited today, no update needed
    return data
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak = data.currentStreak
  
  if (lastVisit === yesterdayStr) {
    // Continuing streak
    newStreak = data.currentStreak + 1
  } else if (lastVisit !== today) {
    // Streak broken or first visit
    newStreak = 1
  }
  
  const updatedData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastVisit: new Date().toISOString(),
    totalVisits: data.totalVisits + 1,
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(updatedData))
  return updatedData
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '🔥'
  if (streak >= 7) return '⚡'
  if (streak >= 3) return '✨'
  return '🌱'
}

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Legendary learner!'
  if (streak >= 14) return 'On fire! Keep it up!'
  if (streak >= 7) return 'Great momentum!'
  if (streak >= 3) return 'Building habits!'
  if (streak === 1) return 'Welcome back!'
  return 'Start your journey!'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const previousData = getStreakData()
    const newData = updateStreak()
    setStreakData(newData)
    
    // Show celebration if streak increased
    if (newData.currentStreak > previousData.currentStreak && newData.currentStreak > 1) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const { currentStreak, longestStreak, totalVisits } = streakData
  const emoji = getStreakEmoji(currentStreak)
  const message = getStreakMessage(currentStreak)

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/30 rounded-full hover:border-primary-500/50 transition-all duration-300"
      >
        <span className="text-xl">{emoji}</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{currentStreak}</span>
          <span className="text-navy-300 text-sm hidden sm:inline">day streak</span>
        </div>
        <svg 
          className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expanded Stats */}
      {isExpanded && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-navy-900 border border-navy-700 rounded-xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-center mb-4">
            <span className="text-4xl">{emoji}</span>
            <p className="text-white font-semibold mt-1">{message}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Current Streak</span>
              <span className="text-white font-bold">{currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Longest Streak</span>
              <span className="text-primary-400 font-bold">{longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Total Visits</span>
              <span className="text-navy-200 font-bold">{totalVisits}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-navy-700">
            <p className="text-xs text-navy-500 text-center">
              Visit daily to build your streak! 🚀
            </p>
          </div>
        </div>
      )}
    </div>
  )
}