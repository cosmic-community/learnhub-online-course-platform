'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalMinutesThisWeek: number
}

const STORAGE_KEY = 'learnhub_streak'

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastLearningDate: null, totalMinutesThisWeek: 0 }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { currentStreak: 0, longestStreak: 0, lastLearningDate: null, totalMinutesThisWeek: 0 }
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastLearningDate: null, totalMinutesThisWeek: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const stored = getStoredStreak()
    setStreak(stored)
    
    // Check if this is a new day and simulate learning activity
    const today = new Date().toDateString()
    if (stored.lastLearningDate !== today) {
      // Simulate that the user has learned today (in a real app, this would be tracked)
      const isConsecutive = stored.lastLearningDate && 
        new Date(stored.lastLearningDate).getTime() > Date.now() - 48 * 60 * 60 * 1000
      
      const newStreak: StreakData = {
        currentStreak: isConsecutive ? stored.currentStreak + 1 : 1,
        longestStreak: Math.max(stored.longestStreak, isConsecutive ? stored.currentStreak + 1 : 1),
        lastLearningDate: today,
        totalMinutesThisWeek: stored.totalMinutesThisWeek + Math.floor(Math.random() * 30) + 15
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak))
      setStreak(newStreak)
      
      // Show celebration if streak increased
      if (newStreak.currentStreak > stored.currentStreak && newStreak.currentStreak >= 3) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }, [])

  useEffect(() => {
    // Animate the flames
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return "Start your learning journey today!"
    if (streak.currentStreak === 1) return "Great start! Come back tomorrow!"
    if (streak.currentStreak < 7) return `${streak.currentStreak} day streak! Keep it up!`
    if (streak.currentStreak < 30) return `${streak.currentStreak} days! You're on fire! 🔥`
    return `${streak.currentStreak} days! You're a learning legend! 👑`
  }

  const getFlameSize = () => {
    if (streak.currentStreak < 3) return 'text-2xl'
    if (streak.currentStreak < 7) return 'text-3xl'
    if (streak.currentStreak < 14) return 'text-4xl'
    return 'text-5xl'
  }

  return (
    <div className="relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="animate-bounce text-4xl">🎉</div>
          <div className="absolute animate-ping text-2xl" style={{ animationDelay: '0.1s' }}>✨</div>
          <div className="absolute animate-ping text-2xl" style={{ animationDelay: '0.2s', left: '20%' }}>⭐</div>
          <div className="absolute animate-ping text-2xl" style={{ animationDelay: '0.3s', right: '20%' }}>🌟</div>
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20">
        <div className="flex items-center gap-4">
          {/* Animated Flame */}
          <div className={`${getFlameSize()} transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
            {streak.currentStreak > 0 ? (
              <span className="inline-block animate-pulse">🔥</span>
            ) : (
              <span className="opacity-50">🕯️</span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{streak.currentStreak}</span>
              <span className="text-navy-400">day streak</span>
            </div>
            <p className="text-sm text-navy-300 mt-1">{getStreakMessage()}</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-navy-400">Best streak</div>
            <div className="text-xl font-semibold text-primary-400">{streak.longestStreak} days</div>
          </div>
        </div>
        
        {/* Weekly Progress Bar */}
        <div className="mt-4 pt-4 border-t border-navy-700/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-navy-400">This week</span>
            <span className="text-primary-400">{streak.totalMinutesThisWeek} minutes</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, (streak.totalMinutesThisWeek / 300) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-navy-500 mt-1">Goal: 300 minutes / week</div>
        </div>
        
        {/* Streak Flames Row */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                i < streak.currentStreak
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-navy-800 text-navy-600'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {i < streak.currentStreak ? '🔥' : '○'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}