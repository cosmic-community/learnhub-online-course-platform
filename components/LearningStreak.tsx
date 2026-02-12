'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastActiveDate: string | null
}

const STORAGE_KEY = 'learnhub_streak_data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, totalDaysLearned: 0, lastActiveDate: null }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { currentStreak: 0, longestStreak: 0, totalDaysLearned: 0, lastActiveDate: null }
    }
  }
  return { currentStreak: 0, longestStreak: 0, totalDaysLearned: 0, lastActiveDate: null }
}

function updateStreak(): StreakData {
  const data = getStreakData()
  const today = new Date().toDateString()
  
  if (data.lastActiveDate === today) {
    return data // Already logged today
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak = data.currentStreak
  
  if (data.lastActiveDate === yesterdayStr) {
    // Consecutive day - increase streak
    newStreak = data.currentStreak + 1
  } else if (data.lastActiveDate !== today) {
    // Streak broken - reset to 1
    newStreak = 1
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    totalDaysLearned: data.totalDaysLearned + 1,
    lastActiveDate: today
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  return newData
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysLearned: 0,
    lastActiveDate: null
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const data = updateStreak()
    setStreakData(data)
    
    // Check for milestone celebrations
    if (data.currentStreak > 0 && data.currentStreak % 7 === 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    // Trigger animation on load
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Unstoppable!'
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    if (streak === 1) return 'Great start!'
    return 'Start your streak!'
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-amber-500/10 opacity-50" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
                {getStreakEmoji(streakData.currentStreak)}
              </span>
              Learning Streak
            </h3>
            {streakData.currentStreak >= 7 && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full animate-pulse">
                Hot streak!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Current Streak */}
            <div className="text-center">
              <div className={`text-4xl font-bold text-white mb-1 ${isAnimating ? 'animate-pulse' : ''}`}>
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 text-sm">Day Streak</div>
            </div>

            {/* Longest Streak */}
            <div className="text-center border-l border-r border-navy-700">
              <div className="text-4xl font-bold text-primary-400 mb-1">
                {streakData.longestStreak}
              </div>
              <div className="text-navy-400 text-sm">Best Streak</div>
            </div>

            {/* Total Days */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">
                {streakData.totalDaysLearned}
              </div>
              <div className="text-navy-400 text-sm">Total Days</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-navy-700">
            <p className="text-center text-navy-300 text-sm">
              {getStreakMessage(streakData.currentStreak)}
            </p>
            
            {/* Streak visualization */}
            <div className="mt-3 flex justify-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all duration-500 ${
                    i < (streakData.currentStreak % 7 || (streakData.currentStreak > 0 ? 7 : 0))
                      ? 'bg-primary-500'
                      : 'bg-navy-700'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <p className="text-center text-navy-500 text-xs mt-2">
              {7 - (streakData.currentStreak % 7 || 7)} days until next milestone
            </p>
          </div>
        </div>
      </div>
    </>
  )
}