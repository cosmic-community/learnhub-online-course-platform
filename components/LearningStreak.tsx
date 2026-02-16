'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
}

const STORAGE_KEY = 'learnhub_streak_data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      lessonsViewed: 0,
    }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid data, reset
    }
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0,
    lessonsViewed: 0,
  }
}

function saveStreakData(data: StreakData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0,
    lessonsViewed: 0,
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = getStreakData()
    const today = getDateString(new Date())
    
    if (data.lastVisit !== today) {
      // New day visit
      const newData = { ...data }
      newData.totalVisits += 1
      
      if (data.lastVisit) {
        const daysDiff = getDaysDifference(data.lastVisit, today)
        
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          newData.currentStreak += 1
          
          // Check for milestone celebrations
          if (newData.currentStreak === 3) {
            setCelebrationMessage('🎉 3-Day Streak! You\'re building momentum!')
            setShowCelebration(true)
          } else if (newData.currentStreak === 7) {
            setCelebrationMessage('🔥 7-Day Streak! A whole week of learning!')
            setShowCelebration(true)
          } else if (newData.currentStreak === 30) {
            setCelebrationMessage('🏆 30-Day Streak! You\'re a learning champion!')
            setShowCelebration(true)
          } else if (newData.currentStreak % 10 === 0) {
            setCelebrationMessage(`⭐ ${newData.currentStreak}-Day Streak! Incredible dedication!`)
            setShowCelebration(true)
          }
        } else if (daysDiff > 1) {
          // Streak broken
          newData.currentStreak = 1
        }
      } else {
        // First visit ever
        newData.currentStreak = 1
        setCelebrationMessage('👋 Welcome to LearnHub! Start your learning journey!')
        setShowCelebration(true)
      }
      
      // Update longest streak
      if (newData.currentStreak > newData.longestStreak) {
        newData.longestStreak = newData.currentStreak
      }
      
      newData.lastVisit = today
      saveStreakData(newData)
      setStreakData(newData)
    } else {
      setStreakData(data)
    }
  }, [])

  // Auto-hide celebration after 5 seconds
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!mounted) {
    return null
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'You\'re on fire!'
    if (streak >= 7) return 'Amazing consistency!'
    if (streak >= 3) return 'Great momentum!'
    if (streak >= 1) return 'Keep it going!'
    return 'Start your streak today!'
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Confetti Animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div
                  className="w-3 h-3 rotate-45"
                  style={{
                    backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Celebration Card */}
          <div className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 shadow-2xl shadow-primary-500/20 animate-bounce-in pointer-events-auto">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">
                {getStreakEmoji(streakData.currentStreak)}
              </div>
              <p className="text-xl font-bold text-white mb-2">{celebrationMessage}</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="mt-4 text-navy-400 hover:text-white text-sm transition-colors"
              >
                Continue learning →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {getStreakEmoji(streakData.currentStreak)} Learning Streak
          </h3>
          <span className="text-xs text-navy-400">Daily Progress</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Current Streak */}
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-3xl font-bold text-primary-400">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Day Streak</div>
          </div>

          {/* Longest Streak */}
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Best Streak</div>
          </div>

          {/* Total Visits */}
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">
              {streakData.totalVisits}
            </div>
            <div className="text-xs text-navy-400 mt-1">Total Days</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center py-2 px-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
          <p className="text-sm text-primary-300">
            {getMotivationalMessage(streakData.currentStreak)}
          </p>
        </div>

        {/* Streak Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to 7-day streak</span>
            <span>{Math.min(streakData.currentStreak, 7)}/7</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((streakData.currentStreak / 7) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="mt-4 flex justify-between">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const today = new Date().getDay()
            const adjustedToday = today === 0 ? 6 : today - 1 // Adjust for Monday start
            const isCompleted = index <= adjustedToday && streakData.currentStreak > adjustedToday - index
            const isToday = index === adjustedToday
            
            return (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs text-navy-500 mb-1">{day}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    isCompleted
                      ? 'bg-primary-500 text-white'
                      : isToday
                      ? 'bg-navy-700 text-navy-300 ring-2 ring-primary-500'
                      : 'bg-navy-800 text-navy-500'
                  }`}
                >
                  {isCompleted ? '✓' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}