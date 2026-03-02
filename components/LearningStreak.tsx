'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const streakKey = 'learnhub-learning-streak'
    const streakData = localStorage.getItem(streakKey)
    
    if (streakData) {
      const { count, lastDate } = JSON.parse(streakData)
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastDate === today || lastDate === yesterday) {
        setStreak(count)
        setIsVisible(count > 0)
      }
    }
  }, [])

  if (!isVisible || streak === 0) return null

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-yellow-500/30">
      <span className="text-xl animate-streak-glow">🔥</span>
      <span className="text-sm font-semibold text-yellow-400">
        {streak} day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  )
}