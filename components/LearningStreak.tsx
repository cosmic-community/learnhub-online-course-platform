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
    const stored = localStorage.getItem('learnhub-streak')
    
    let streakData: StreakData = stored 
      ? JSON.parse(stored) 
      : { currentStreak: 0, lastVisit: '', totalVisits: 0 }

    const lastVisitDate = streakData.lastVisit ? new Date(streakData.lastVisit) : null
    const todayDate = new Date(today)

    if (streakData.lastVisit !== today) {
      // Check if this is a consecutive day
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak!
          streakData.currentStreak += 1
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        } else if (diffDays > 1) {
          // Streak broken - reset
          streakData.currentStreak = 1
        }
      } else {
        // First visit ever
        streakData.currentStreak = 1
      }
      
      streakData.lastVisit = today
      streakData.totalVisits += 1
      localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
    }

    setStreak(streakData)
  }, [])

  if (!streak) return null

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '⭐'
    if (count >= 7) return '🔥'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number): string => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'Two weeks strong!'
    if (count >= 7) return 'On fire!'
    if (count >= 3) return 'Building momentum!'
    return 'Keep it up!'
  }

  return (
    <div className="relative">
      <div className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gradient-to-r from-orange-500/20 to-yellow-500/20 
        border border-orange-500/30 rounded-full
        transition-all duration-500
        ${showCelebration ? 'scale-110 shadow-lg shadow-orange-500/25' : ''}
      `}>
        <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
          {getStreakEmoji(streak.currentStreak)}
        </span>
        <div className="text-sm">
          <span className="font-bold text-orange-400">{streak.currentStreak} day</span>
          <span className="text-orange-300/70"> streak</span>
        </div>
      </div>
      
      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-xs text-orange-400 font-medium whitespace-nowrap">
            {getStreakMessage(streak.currentStreak)} 🎉
          </span>
        </div>
      )}
    </div>
  )
}