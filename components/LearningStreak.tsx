'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Streak continues!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken, start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit
      const newStreak: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return '👑'
    if (count >= 14) return '🔥'
    if (count >= 7) return '⚡'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number) => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'On fire!'
    if (count >= 7) return 'Week warrior!'
    if (count >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
      
      <div className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-full
        bg-gradient-to-r from-amber-500/20 to-orange-500/20
        border border-amber-500/30
        transition-all duration-500
        ${showCelebration ? 'scale-110 shadow-lg shadow-amber-500/25' : ''}
      `}>
        <span className="text-2xl animate-pulse">{getStreakEmoji(streak.currentStreak)}</span>
        <div className="text-left">
          <div className="text-white font-bold text-lg leading-tight">
            {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
          </div>
          <div className="text-amber-300 text-xs">
            {getStreakMessage(streak.currentStreak)}
          </div>
        </div>
      </div>
    </div>
  )
}