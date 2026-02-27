'use client'

import { useState, useEffect } from 'react'

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [showFire, setShowFire] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedStreak = localStorage.getItem('learning-streak')
    const storedLastVisit = localStorage.getItem('last-visit-date')

    if (storedLastVisit) {
      const lastDate = new Date(storedLastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(parseInt(storedStreak || '1'))
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = (parseInt(storedStreak || '0') + 1)
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        localStorage.setItem('last-visit-date', today)
        setShowFire(true)
        setTimeout(() => setShowFire(false), 2000)
      } else {
        // Streak broken, reset
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        localStorage.setItem('last-visit-date', today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-visit-date', today)
    }

    setLastVisit(today)
  }, [])

  if (streak === 0) return null

  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full">
      <span className={`text-xl ${showFire ? 'animate-bounce' : ''}`}>
        🔥
      </span>
      <span className="text-orange-400 font-semibold">
        {streak} day{streak !== 1 ? 's' : ''} streak!
      </span>
      {showFire && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
      )}
    </div>
  )
}