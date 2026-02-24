'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisit === today) {
        // Same day visit
        setStreakData(data)
      } else if (lastVisit === yesterdayStr) {
        // Continuing streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700">
        <span className="w-4 h-4 rounded-full bg-navy-600 animate-pulse" />
        <span className="text-navy-400 text-sm">Loading...</span>
      </div>
    )
  }

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
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className="relative">
      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
      
      <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-navy-800/80 to-navy-900/80 border border-navy-700 backdrop-blur-sm transition-all duration-300 ${showCelebration ? 'scale-110 border-primary-500/50' : ''}`}>
        <span className="text-2xl animate-pulse-slow">{getStreakEmoji(streakData.currentStreak)}</span>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{streakData.currentStreak}</span>
            <span className="text-navy-400 text-sm">day streak</span>
          </div>
          <span className="text-primary-400 text-xs font-medium">{getStreakMessage(streakData.currentStreak)}</span>
        </div>
        
        <div className="h-8 w-px bg-navy-700" />
        
        <div className="text-center">
          <div className="text-navy-300 font-semibold">{streakData.totalDays}</div>
          <div className="text-navy-500 text-xs">total days</div>
        </div>
      </div>
    </div>
  )
}