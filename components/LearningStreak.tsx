'use client'

import { useEffect, useState } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

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
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken, start over
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'On fire!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className="relative">
      <div className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-full 
        bg-gradient-to-r from-orange-500/20 to-yellow-500/20 
        border border-orange-500/30
        transition-all duration-500
        ${showCelebration ? 'scale-110 shadow-lg shadow-orange-500/30' : ''}
      `}>
        <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
          {getStreakEmoji(streakData.currentStreak)}
        </span>
        <div className="flex flex-col">
          <span className="text-orange-400 font-bold text-lg leading-tight">
            {streakData.currentStreak} day streak
          </span>
          <span className="text-orange-300/70 text-xs">
            {getStreakMessage(streakData.currentStreak)}
          </span>
        </div>
      </div>
      
      {showCelebration && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {['🎉', '⭐', '✨'].map((emoji, i) => (
            <span
              key={i}
              className="animate-ping text-xl"
              style={{ 
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s',
                animationIterationCount: '3'
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}