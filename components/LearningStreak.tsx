'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const STORAGE_KEY = 'learnhub-streak-data'

function getStoredData(): StreakData | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

function saveData(data: StreakData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const storedData = getStoredData()
    const today = new Date()
    
    if (!storedData) {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        totalVisits: 1,
        longestStreak: 1
      }
      saveData(newData)
      setStreakData(newData)
      setShowCelebration(true)
    } else {
      const lastVisitDate = new Date(storedData.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Same day, no streak change
        setStreakData(storedData)
      } else if (isYesterday(lastVisitDate, today)) {
        // Consecutive day, increase streak
        const newStreak = storedData.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today.toISOString(),
          totalVisits: storedData.totalVisits + 1,
          longestStreak: Math.max(storedData.longestStreak, newStreak)
        }
        saveData(newData)
        setStreakData(newData)
        
        // Show celebration for milestone streaks
        if (newStreak % 5 === 0 || newStreak === 7 || newStreak === 30) {
          setShowCelebration(true)
        }
      } else {
        // Streak broken
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today.toISOString(),
          totalVisits: storedData.totalVisits + 1,
          longestStreak: storedData.longestStreak
        }
        saveData(newData)
        setStreakData(newData)
      }
    }
    
    // Show widget after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData || !isVisible) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'One week streak!'
    if (streak >= 3) return 'Keep it up!'
    return 'Great start!'
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed top-24 right-5 z-40 w-12 h-12 rounded-full streak-badge flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform"
        aria-label="Show learning streak"
      >
        <span className={`text-lg ${streakData.currentStreak >= 3 ? 'animate-fire' : ''}`}>
          {getStreakEmoji(streakData.currentStreak)}
        </span>
        <span className="absolute -bottom-1 -right-1 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {streakData.currentStreak}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce-subtle">
            🎉
          </div>
        </div>
      )}
      
      {/* Streak widget */}
      <div className="fixed top-24 right-5 z-40 animate-fade-in-right">
        <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 shadow-xl w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${streakData.currentStreak >= 3 ? 'animate-fire' : ''}`}>
                {getStreakEmoji(streakData.currentStreak)}
              </span>
              <div>
                <div className="text-sm text-navy-400">Learning Streak</div>
                <div className="text-2xl font-bold text-white">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-navy-500 hover:text-navy-300 transition-colors p-1"
              aria-label="Minimize streak widget"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
          
          {/* Message */}
          <div className="text-sm text-primary-400 mb-3">
            {getStreakMessage(streakData.currentStreak)}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-navy-800/50 rounded-lg p-2">
              <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-2">
              <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
          </div>
          
          {/* Progress to next milestone */}
          {streakData.currentStreak < 7 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Next milestone</span>
                <span>{streakData.currentStreak}/7 days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(streakData.currentStreak / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}