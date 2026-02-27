'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

const STREAK_KEY = 'learnhub_streak_data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDays: 0 }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDays: 0 }
    }
  }
  return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDays: 0 }
}

function updateStreak(): StreakData {
  const data = getStreakData()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  if (data.lastVisit === today) {
    // Already visited today
    return data
  }
  
  let newStreak = data.currentStreak
  
  if (data.lastVisit === yesterday) {
    // Consecutive day!
    newStreak = data.currentStreak + 1
  } else if (data.lastVisit === '') {
    // First visit ever
    newStreak = 1
  } else {
    // Streak broken, start fresh
    newStreak = 1
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastVisit: today,
    totalDays: data.totalDays + 1
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ 
    currentStreak: 0, 
    longestStreak: 0, 
    lastVisit: '', 
    totalDays: 0 
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = updateStreak()
    setStreak(data)
    
    // Trigger animation on mount
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 bg-gradient-to-br from-navy-800/80 to-navy-900/80">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-32 mb-4"></div>
          <div className="h-16 bg-navy-700 rounded w-24 mb-4"></div>
          <div className="h-4 bg-navy-700 rounded w-48"></div>
        </div>
      </div>
    )
  }

  const getStreakEmoji = (days: number): string => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '🔥'
    if (days >= 7) return '⭐'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number): string => {
    if (days >= 30) return "Legendary learner! You're unstoppable!"
    if (days >= 14) return "Two weeks strong! Keep it up!"
    if (days >= 7) return "One week streak! You're on fire!"
    if (days >= 3) return "Great momentum! Keep going!"
    if (days === 1) return "Every journey starts with day one!"
    return "Start your learning streak today!"
  }

  const streakPercentage = Math.min((streak.currentStreak / 30) * 100, 100)

  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-800/80 to-navy-900/80 border-primary-500/20 relative overflow-hidden">
      {/* Animated background glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 transition-opacity duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{
          animation: isAnimating ? 'pulse 3s ease-in-out infinite' : 'none'
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji(streak.currentStreak)}</span>
            Learning Streak
          </h3>
          <div className="text-xs text-navy-400 bg-navy-800/50 px-2 py-1 rounded-full">
            Best: {streak.longestStreak} days
          </div>
        </div>
        
        {/* Main streak number with animation */}
        <div className="flex items-baseline gap-2 mb-3">
          <span 
            className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300 transition-all duration-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          >
            {streak.currentStreak}
          </span>
          <span className="text-navy-400 text-lg">
            {streak.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        
        {/* Progress bar to next milestone */}
        <div className="mb-3">
          <div className="h-2 bg-navy-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${isAnimating ? streakPercentage : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-navy-500 mt-1">
            <span>0 days</span>
            <span>30 day goal 🏆</span>
          </div>
        </div>
        
        {/* Motivational message */}
        <p className="text-navy-300 text-sm">
          {getStreakMessage(streak.currentStreak)}
        </p>
        
        {/* Weekly activity dots */}
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const isActive = i < Math.min(streak.currentStreak, 7)
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50' 
                    : 'bg-navy-800/50 text-navy-600 border border-navy-700/50'
                }`}
                style={{
                  transitionDelay: `${i * 100}ms`,
                  transform: isAnimating && isActive ? 'scale(1)' : 'scale(0.8)',
                  opacity: isAnimating ? 1 : 0
                }}
              >
                {isActive ? '✓' : '○'}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}