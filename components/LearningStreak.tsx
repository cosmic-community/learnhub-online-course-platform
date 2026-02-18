'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showFlame, setShowFlame] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, just show current streak
        setStreak(data)
      } else if (diffDays === 1) {
        // Consecutive day! Increment streak
        const newStreak = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setShowFlame(true)
      } else {
        // Streak broken, reset to 1
        const newStreak = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowFlame(true)
    }
  }, [])

  if (!streak) return null

  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
      {/* Animated flame icon */}
      <div className={`relative ${showFlame ? 'animate-bounce' : ''}`}>
        <span className="text-2xl">🔥</span>
        {showFlame && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg leading-none">
          {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
        </span>
        <span className="text-orange-300 text-xs">
          learning streak
        </span>
      </div>

      {/* Sparkle particles when streak is active */}
      {showFlame && streak.currentStreak > 1 && (
        <div className="absolute -inset-1 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}