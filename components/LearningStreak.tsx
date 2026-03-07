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
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday - continue streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
        }
        setStreak(newStreak)
        setIsNewDay(true)
        setShowCelebration(true)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      } else {
        // Streak broken - start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
        }
        setStreak(newStreak)
        setIsNewDay(true)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      }
    } else {
      // First visit ever!
      const newStreak: StreakData = {
        currentStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
      }
      setStreak(newStreak)
      setIsNewDay(true)
      setShowCelebration(true)
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
    }
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streak) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700">
        <div className="w-4 h-4 rounded-full bg-navy-600 animate-pulse" />
        <span className="text-navy-400 text-sm">Loading streak...</span>
      </div>
    )
  }

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return '👑'
    if (count >= 14) return '🔥'
    if (count >= 7) return '⚡'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number) => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'On fire!'
    if (count >= 7) return 'Week warrior!'
    if (count >= 3) return 'Building momentum!'
    if (count === 1) return 'Great start!'
    return 'Keep it up!'
  }

  return (
    <div className="relative inline-block">
      {/* Celebration confetti */}
      {showCelebration && (
        <div className="absolute -inset-4 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 5],
              }}
            />
          ))}
        </div>
      )}
      
      <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-navy-800/80 to-navy-900/80 border border-navy-700/50 backdrop-blur-sm transition-all duration-300 ${isNewDay ? 'animate-glow' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce-slow">{getStreakEmoji(streak.currentStreak)}</span>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-white">{streak.currentStreak}</span>
              <span className="text-navy-300 text-sm">day{streak.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-xs text-primary-400 font-medium">{getStreakMessage(streak.currentStreak)}</span>
          </div>
        </div>
        
        {/* Streak flame indicator */}
        <div className="flex -space-x-1">
          {[...Array(Math.min(streak.currentStreak, 5))].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-t from-orange-500 to-yellow-400"
              style={{ 
                opacity: 0.3 + (i * 0.15),
                animation: `flame ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* New day celebration badge */}
      {isNewDay && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg animate-pulse">
          +1
        </div>
      )}
    </div>
  )
}