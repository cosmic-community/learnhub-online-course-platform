'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learning-streak')
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisit === yesterdayStr) {
        // Continuing streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalDays: data.totalDays + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreak(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken, reset
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalDays: data.totalDays + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreak(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreak(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (days: number): string => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '⭐'
    if (days >= 7) return '🔥'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number): string => {
    if (days >= 30) return 'Legendary learner!'
    if (days >= 14) return 'On fire!'
    if (days >= 7) return 'Great momentum!'
    if (days >= 3) return 'Keep it up!'
    return 'Just starting!'
  }

  return (
    <div className="relative inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full border border-primary-500/30 backdrop-blur-sm">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-20" />
        </div>
      )}
      
      <span className="text-2xl animate-bounce-subtle">{getStreakEmoji(streak.currentStreak)}</span>
      
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">{streak.currentStreak}</span>
          <span className="text-primary-300 text-sm">day streak</span>
        </div>
        <span className="text-primary-400 text-xs">{getStreakMessage(streak.currentStreak)}</span>
      </div>

      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-primary-300 animate-fade-up whitespace-nowrap">
          🎉 Streak continued!
        </div>
      )}
    </div>
  )
}