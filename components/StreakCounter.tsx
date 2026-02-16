'use client'

import { useState, useEffect } from 'react'

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedStreak = localStorage.getItem('learnhub-streak')
      const storedLastVisit = localStorage.getItem('learnhub-last-visit')
      const today = new Date().toDateString()

      if (storedLastVisit && storedStreak) {
        const lastDate = new Date(storedLastVisit)
        const todayDate = new Date(today)
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
          // Same day, keep streak
          setStreak(parseInt(storedStreak))
        } else if (diffDays === 1) {
          // Consecutive day, increment streak
          const newStreak = parseInt(storedStreak) + 1
          setStreak(newStreak)
          localStorage.setItem('learnhub-streak', newStreak.toString())
          localStorage.setItem('learnhub-last-visit', today)
        } else {
          // Streak broken, reset to 1
          setStreak(1)
          localStorage.setItem('learnhub-streak', '1')
          localStorage.setItem('learnhub-last-visit', today)
        }
      } else {
        // First visit
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
        localStorage.setItem('learnhub-last-visit', today)
      }

      setLastVisit(today)
    }
  }, [])

  if (!mounted || streak === 0) return null

  const getStreakEmoji = () => {
    if (streak >= 30) return '🔥👑'
    if (streak >= 14) return '🔥🔥'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '✨'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "On fire!"
    if (streak >= 7) return "Amazing week!"
    if (streak >= 3) return "Building momentum!"
    return "Keep it up!"
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30">
      <span className="text-lg">{getStreakEmoji()}</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-orange-400">{streak} day streak</span>
        <span className="text-xs text-orange-300/70">{getStreakMessage()}</span>
      </div>
    </div>
  )
}