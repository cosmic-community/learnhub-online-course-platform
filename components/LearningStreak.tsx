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
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDays: 0 }
  }
  
  try {
    return JSON.parse(stored) as StreakData
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalDays: 0 }
  }
}

function updateStreak(): StreakData {
  const today = new Date().toDateString()
  const data = getStreakData()
  
  if (data.lastVisit === today) {
    return data
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const wasYesterday = data.lastVisit === yesterday.toDateString()
  
  const newData: StreakData = {
    currentStreak: wasYesterday ? data.currentStreak + 1 : 1,
    longestStreak: Math.max(data.longestStreak, wasYesterday ? data.currentStreak + 1 : 1),
    lastVisit: today,
    totalDays: data.totalDays + 1
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  }
  
  return newData
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDays: 0
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    const oldData = getStreakData()
    const newData = updateStreak()
    setStreakData(newData)
    
    // Show celebration for streak milestones
    if (newData.currentStreak > oldData.currentStreak && 
        (newData.currentStreak === 7 || newData.currentStreak === 30 || newData.currentStreak % 100 === 0)) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    // Check if this is a new day visit
    if (oldData.lastVisit !== newData.lastVisit) {
      setIsNew(true)
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 365) return '🏆'
    if (streak >= 100) return '💎'
    if (streak >= 30) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 365) return 'Legendary learner!'
    if (streak >= 100) return 'Unstoppable!'
    if (streak >= 30) return 'On fire!'
    if (streak >= 7) return 'Great momentum!'
    if (streak >= 3) return 'Building habits!'
    if (streak >= 1) return 'Great start!'
    return 'Start learning today!'
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '1.5rem'
              }}
            >
              {['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className={`card p-6 transition-all duration-500 ${isNew ? 'ring-2 ring-primary-500/50' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl animate-pulse">{getStreakEmoji(streakData.currentStreak)}</span>
            Learning Streak
          </h3>
          {isNew && (
            <span className="badge bg-primary-500/20 text-primary-400 text-xs animate-bounce">
              +1 day!
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-400 tabular-nums">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Current Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400 tabular-nums">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Best Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 tabular-nums">
              {streakData.totalDays}
            </div>
            <div className="text-xs text-navy-400 mt-1">Total Days</div>
          </div>
        </div>

        <p className="text-sm text-navy-300 text-center mt-4">
          {getStreakMessage(streakData.currentStreak)}
        </p>

        {/* Streak Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Next milestone</span>
            <span>
              {streakData.currentStreak < 7 && `${7 - streakData.currentStreak} days to ⚡`}
              {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && `${30 - streakData.currentStreak} days to 🔥`}
              {streakData.currentStreak >= 30 && streakData.currentStreak < 100 && `${100 - streakData.currentStreak} days to 💎`}
              {streakData.currentStreak >= 100 && streakData.currentStreak < 365 && `${365 - streakData.currentStreak} days to 🏆`}
              {streakData.currentStreak >= 365 && 'You did it! 🏆'}
            </span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${Math.min(100, (streakData.currentStreak / (
                  streakData.currentStreak < 7 ? 7 :
                  streakData.currentStreak < 30 ? 30 :
                  streakData.currentStreak < 100 ? 100 : 365
                )) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}