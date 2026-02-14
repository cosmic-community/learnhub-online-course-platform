'use client'

import { useState, useEffect } from 'react'

interface StreakCounterProps {
  compact?: boolean
}

export default function StreakCounter({ compact = false }: StreakCounterProps) {
  const [streak, setStreak] = useState(0)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [showFlame, setShowFlame] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const storedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const today = new Date().toDateString()

    if (storedStreak && lastVisit) {
      const lastVisitDate = new Date(lastVisit)
      const daysDiff = Math.floor(
        (new Date().getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff === 0) {
        // Same day - maintain streak
        setStreak(parseInt(storedStreak))
        setTodayCompleted(true)
      } else if (daysDiff === 1) {
        // Next day - streak continues
        const newStreak = parseInt(storedStreak) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        localStorage.setItem('learnhub-last-visit', today)
        setTodayCompleted(true)
        setShowFlame(true)
      } else {
        // Streak broken - reset
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
        localStorage.setItem('learnhub-last-visit', today)
        setTodayCompleted(true)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub-streak', '1')
      localStorage.setItem('learnhub-last-visit', today)
      setTodayCompleted(true)
    }
  }, [])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Legendary learner!"
    if (streak >= 14) return "🌟 On fire!"
    if (streak >= 7) return "💪 Building momentum!"
    if (streak >= 3) return "🚀 Great start!"
    return "🎯 Keep it up!"
  }

  const getFlameSize = () => {
    if (streak >= 30) return 'text-5xl'
    if (streak >= 14) return 'text-4xl'
    if (streak >= 7) return 'text-3xl'
    return 'text-2xl'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
        <span className={`${showFlame ? 'animate-bounce' : ''}`}>🔥</span>
        <span className="text-sm font-bold text-orange-400">{streak}</span>
      </div>
    )
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border-orange-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
        <span className="text-sm text-navy-400">{getStreakMessage()}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={`${getFlameSize()} ${showFlame ? 'animate-pulse' : ''} transition-all duration-500`}>
          🔥
        </div>
        <div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            {streak}
          </div>
          <div className="text-sm text-navy-400">
            {streak === 1 ? 'day' : 'days'} in a row
          </div>
        </div>
      </div>

      {/* Weekly progress dots */}
      <div className="mt-4 pt-4 border-t border-navy-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-navy-500">This week</span>
          <span className="text-xs text-navy-500">{Math.min(streak, 7)}/7 days</span>
        </div>
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < Math.min(streak, 7)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-navy-800'
              }`}
            />
          ))}
        </div>
      </div>

      {todayCompleted && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Today's learning completed!
        </div>
      )}
    </div>
  )
}