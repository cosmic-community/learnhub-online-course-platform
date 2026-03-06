'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const STREAK_KEY = 'learnhub-streak'

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
  
  try {
    const stored = localStorage.getItem(STREAK_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore errors
  }
  
  return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function updateStreak(stored: StreakData): StreakData {
  const today = getDateString(new Date())
  const yesterday = getDateString(new Date(Date.now() - 86400000))
  
  if (stored.lastVisit === today) {
    // Already visited today, no changes
    return stored
  }
  
  let newStreak = stored.currentStreak
  
  if (stored.lastVisit === yesterday) {
    // Consecutive day, increment streak
    newStreak = stored.currentStreak + 1
  } else if (stored.lastVisit === '') {
    // First visit ever
    newStreak = 1
  } else {
    // Streak broken, start over
    newStreak = 1
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(stored.longestStreak, newStreak),
    lastVisit: today,
    totalVisits: stored.totalVisits + 1
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  
  return newData
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const stored = getStoredStreak()
    const today = getDateString(new Date())
    const wasNewDay = stored.lastVisit !== today && stored.lastVisit !== ''
    
    const updated = updateStreak(stored)
    setStreak(updated)
    setIsNewDay(wasNewDay)
    
    // Show welcome message after a short delay
    const timer = setTimeout(() => setShowMessage(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!streak || streak.currentStreak === 0) {
    return null
  }

  const getMessage = () => {
    if (streak.currentStreak === 1 && streak.totalVisits === 1) {
      return "Welcome to LearnHub! 🎉 Your learning journey begins today!"
    }
    if (isNewDay && streak.currentStreak > 1) {
      return `Amazing! ${streak.currentStreak} day streak! 🔥 Keep the momentum going!`
    }
    if (streak.currentStreak >= 7) {
      return `Incredible ${streak.currentStreak} day streak! 🏆 You're unstoppable!`
    }
    if (streak.currentStreak >= 3) {
      return `${streak.currentStreak} day streak! 💪 You're building great habits!`
    }
    return `Welcome back! 👋 Day ${streak.currentStreak} of your learning streak!`
  }

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 30) return '👑'
    if (streak.currentStreak >= 14) return '🏆'
    if (streak.currentStreak >= 7) return '⭐'
    if (streak.currentStreak >= 3) return '🔥'
    return '✨'
  }

  return (
    <div 
      className={`
        inline-flex items-center gap-3 px-5 py-3 
        bg-gradient-to-r from-orange-500/10 to-yellow-500/10 
        border border-orange-500/20 rounded-full
        transition-all duration-500
        ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-2xl animate-bounce-subtle">{getStreakEmoji()}</span>
        <span className="text-orange-400 font-bold text-lg">{streak.currentStreak}</span>
        <span className="text-orange-300/80 text-sm">day{streak.currentStreak !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="w-px h-6 bg-orange-500/20" />
      
      <span className="text-orange-200/90 text-sm font-medium max-w-[200px] sm:max-w-none">
        {getMessage()}
      </span>
      
      {streak.longestStreak > streak.currentStreak && (
        <>
          <div className="hidden sm:block w-px h-6 bg-orange-500/20" />
          <span className="hidden sm:inline text-orange-400/60 text-xs">
            Best: {streak.longestStreak} days
          </span>
        </>
      )}
    </div>
  )
}