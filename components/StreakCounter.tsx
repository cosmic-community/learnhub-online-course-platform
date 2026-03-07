'use client'

import { useState, useEffect } from 'react'

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedStreak = localStorage.getItem('learnhub-streak')
    const storedLastVisit = localStorage.getItem('learnhub-last-visit')

    if (storedLastVisit) {
      setLastVisit(storedLastVisit)
      const lastVisitDate = new Date(storedLastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(parseInt(storedStreak || '1'))
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = parseInt(storedStreak || '0') + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        localStorage.setItem('learnhub-last-visit', today)
        
        // Show celebration for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
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
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '👑'
    if (streak >= 21) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🌟'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return 'Learning Legend!'
    if (streak >= 21) return 'On Fire!'
    if (streak >= 14) return 'Unstoppable!'
    if (streak >= 7) return 'One Week Strong!'
    if (streak >= 3) return 'Building Momentum!'
    return 'Great Start!'
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-2 bg-navy-800/50 border border-navy-700 rounded-full">
        <span className="text-xl">{getStreakEmoji()}</span>
        <div className="text-sm">
          <span className="font-bold text-white">{streak}</span>
          <span className="text-navy-400 ml-1">day{streak !== 1 ? 's' : ''}</span>
        </div>
        <span className="text-xs text-primary-400 hidden sm:inline">{getStreakMessage()}</span>
      </div>
      
      {showCelebration && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            🎉 Milestone!
          </div>
        </div>
      )}
    </div>
  )
}