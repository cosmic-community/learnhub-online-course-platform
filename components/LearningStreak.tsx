'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const STREAK_KEY = 'learnhub_streak'

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, lastVisit: '', totalVisits: 0, longestStreak: 0 }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (!stored) {
    return { currentStreak: 0, lastVisit: '', totalVisits: 0, longestStreak: 0 }
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return { currentStreak: 0, lastVisit: '', totalVisits: 0, longestStreak: 0 }
  }
}

function updateStreak(): { data: StreakData; isNewMilestone: boolean } {
  const today = new Date().toDateString()
  const stored = getStoredStreak()
  
  // Already visited today
  if (stored.lastVisit === today) {
    return { data: stored, isNewMilestone: false }
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak = stored.currentStreak
  let isNewMilestone = false
  
  if (stored.lastVisit === yesterdayStr) {
    // Continuing streak
    newStreak = stored.currentStreak + 1
  } else if (stored.lastVisit === '') {
    // First visit ever
    newStreak = 1
  } else {
    // Streak broken, start fresh
    newStreak = 1
  }
  
  // Check for milestone (every 5 days or special numbers)
  const milestones = [3, 5, 7, 10, 14, 21, 30, 50, 100]
  if (milestones.includes(newStreak)) {
    isNewMilestone = true
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    lastVisit: today,
    totalVisits: stored.totalVisits + 1,
    longestStreak: Math.max(stored.longestStreak, newStreak)
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  
  return { data: newData, isNewMilestone }
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const { data, isNewMilestone } = updateStreak()
    setStreak(data)
    
    if (isNewMilestone) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!mounted || !streak) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-16 bg-navy-800 rounded"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <div className={`card p-6 transition-all duration-500 ${showCelebration ? 'ring-2 ring-primary-400 shadow-lg shadow-primary-500/20' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Flame Icon with Animation */}
            <div className={`text-4xl ${streak.currentStreak >= 3 ? 'animate-pulse' : ''}`}>
              {streak.currentStreak >= 7 ? '🔥' : streak.currentStreak >= 3 ? '🌟' : '✨'}
            </div>
            
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{streak.currentStreak}</span>
                <span className="text-navy-400">day streak</span>
              </div>
              <p className="text-sm text-navy-500">
                {streak.currentStreak === 0 
                  ? "Start your learning journey today!"
                  : streak.currentStreak === 1 
                    ? "Great start! Come back tomorrow!"
                    : streak.currentStreak < 7
                      ? "Keep it up! You're building momentum!"
                      : "You're on fire! Amazing dedication!"}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 text-center">
            <div>
              <div className="text-xl font-semibold text-white">{streak.totalVisits}</div>
              <div className="text-xs text-navy-500">Total Visits</div>
            </div>
            <div className="w-px h-8 bg-navy-700"></div>
            <div>
              <div className="text-xl font-semibold text-primary-400">{streak.longestStreak}</div>
              <div className="text-xs text-navy-500">Best Streak</div>
            </div>
          </div>
        </div>
        
        {/* Streak Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-navy-500 mb-1">
            <span>Progress to 7-day badge</span>
            <span>{Math.min(streak.currentStreak, 7)}/7</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
              style={{ width: `${Math.min((streak.currentStreak / 7) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Celebration Message */}
        {showCelebration && (
          <div className="mt-4 text-center py-2 bg-primary-500/20 rounded-lg animate-pulse">
            <span className="text-primary-400 font-semibold">
              🎉 Amazing! {streak.currentStreak}-day streak achieved!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}