'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

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
        // Visited yesterday - increment streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreak(newData)
        setShowAnimation(true)
      } else {
        // Streak broken - start over
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreak(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreak(newData)
      setShowAnimation(true)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '🔥'
    if (days >= 7) return '⭐'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number) => {
    if (days >= 30) return 'Legendary learner!'
    if (days >= 14) return "You're on fire!"
    if (days >= 7) return 'Keep it up!'
    if (days >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/30 rounded-full transition-all duration-500 ${
        showAnimation ? 'animate-bounce' : ''
      }`}
    >
      <span className="text-2xl">{getStreakEmoji(streak.currentStreak)}</span>
      <div className="text-left">
        <div className="text-white font-bold text-sm">
          {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''} streak
        </div>
        <div className="text-primary-300 text-xs">
          {getStreakMessage(streak.currentStreak)}
        </div>
      </div>
    </div>
  )
}