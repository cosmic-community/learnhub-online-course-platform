'use client'

import { useState, useEffect } from 'react'

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const currentStreak = parseInt(localStorage.getItem('learning-streak') || '0')
    setStreak(currentStreak)
    
    // Show animation for significant streaks
    if (currentStreak >= 3) {
      setShowAnimation(true)
    }
  }, [])

  if (streak === 0) return null

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 ${showAnimation ? 'animate-bounce' : ''}`}>
      <span className="text-2xl">🔥</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-orange-400">{streak} day streak!</span>
        <span className="text-xs text-navy-400">Keep it up!</span>
      </div>
    </div>
  )
}