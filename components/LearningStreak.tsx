'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [lastVisit, setLastVisit] = useState<string | null>(null)

  useEffect(() => {
    // Get stored streak data
    const storedStreak = localStorage.getItem('learning-streak')
    const storedDate = localStorage.getItem('learning-streak-date')
    const today = new Date().toDateString()

    if (storedDate && storedStreak) {
      const lastDate = new Date(storedDate)
      const currentDate = new Date(today)
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(parseInt(storedStreak))
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = parseInt(storedStreak) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        localStorage.setItem('learning-streak-date', today)
      } else {
        // Streak broken, reset
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        localStorage.setItem('learning-streak-date', today)
      }
      setLastVisit(storedDate)
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('learning-streak-date', today)
    }

    setTimeout(() => setIsVisible(true), 800)
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "On fire! Keep it up!"
    if (streak >= 7) return "Great momentum!"
    if (streak >= 3) return "Building habits!"
    return "Welcome back!"
  }

  if (streak === 0) return null

  return (
    <div 
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full">
        <span className="text-lg">{getStreakEmoji()}</span>
        <span className="text-sm font-medium text-amber-400">
          {streak} day streak
        </span>
        <span className="text-xs text-amber-500/70">
          — {getStreakMessage()}
        </span>
      </div>
    </div>
  )
}