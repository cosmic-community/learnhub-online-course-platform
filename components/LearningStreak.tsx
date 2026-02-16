'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const STREAK_KEY = 'learnhub_streak'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
  
  try {
    const stored = localStorage.getItem(STREAK_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parsing errors
  }
  
  return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
}

function updateStreak(): StreakData {
  const today = new Date().toDateString()
  const data = getStreakData()
  
  if (data.lastVisit === today) {
    // Already visited today
    return data
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak: number
  if (data.lastVisit === yesterdayStr) {
    // Consecutive day
    newStreak = data.currentStreak + 1
  } else if (data.lastVisit === '') {
    // First visit
    newStreak = 1
  } else {
    // Streak broken
    newStreak = 1
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak),
    lastVisit: today,
    totalVisits: data.totalVisits + 1,
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '🔥'
  if (streak >= 7) return '⭐'
  if (streak >= 3) return '✨'
  return '🌱'
}

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Learning Champion!'
  if (streak >= 14) return 'On Fire!'
  if (streak >= 7) return 'Great Progress!'
  if (streak >= 3) return 'Building Momentum!'
  if (streak === 1) return 'Great Start!'
  return 'Keep Learning!'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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

  if (!streakData || streakData.totalVisits === 0) {
    return null
  }

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">
            {getStreakEmoji(streakData.currentStreak)}
          </div>
        </div>
      )}
      
      {/* Streak widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group flex items-center gap-2 px-4 py-2 
            bg-navy-900/90 backdrop-blur-sm border border-navy-700 
            rounded-full shadow-lg hover:border-primary-500/50 
            transition-all duration-300
            ${isExpanded ? 'rounded-2xl' : ''}
          `}
        >
          <span className="text-xl">{getStreakEmoji(streakData.currentStreak)}</span>
          <span className="text-white font-semibold">{streakData.currentStreak}</span>
          <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {isExpanded && (
            <div className="ml-2 pl-2 border-l border-navy-700 flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-navy-400">Best</div>
                <div className="text-primary-400 font-bold">{streakData.longestStreak}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-navy-400">Total</div>
                <div className="text-primary-400 font-bold">{streakData.totalVisits}</div>
              </div>
            </div>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 px-4 py-2 bg-navy-900/90 backdrop-blur-sm border border-navy-700 rounded-xl">
            <p className="text-sm text-primary-400 font-medium">
              {getStreakMessage(streakData.currentStreak)}
            </p>
            <p className="text-xs text-navy-400 mt-1">
              Visit daily to build your streak
            </p>
          </div>
        )}
      </div>
    </>
  )
}