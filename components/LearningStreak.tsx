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
    const stored = localStorage.getItem('learning-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        
        // Show celebration for streak milestones
        if (newStreak.currentStreak % 7 === 0 || newStreak.currentStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '⭐'
    if (days >= 7) return '🔥'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number) => {
    if (days >= 30) return 'Incredible dedication!'
    if (days >= 14) return 'You\'re on fire!'
    if (days >= 7) return 'One week strong!'
    if (days >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className="mb-8 relative">
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-ping">
            🎉
          </div>
        </div>
      )}
      
      <div className="inline-flex items-center gap-3 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-2 animate-fade-in-down">
        <span className="text-2xl animate-bounce-slow">{getStreakEmoji(streak.currentStreak)}</span>
        <div className="flex items-center gap-2">
          <span className="text-primary-400 font-bold">{streak.currentStreak} day streak</span>
          <span className="text-navy-500">•</span>
          <span className="text-navy-400 text-sm">{getStreakMessage(streak.currentStreak)}</span>
        </div>
      </div>
    </div>
  )
}