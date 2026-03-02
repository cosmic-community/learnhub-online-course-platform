'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  totalVisits: 0,
  lessonsViewed: 0,
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterday) {
        // Continuing streak!
        const newStreak: StreakData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        
        // Celebrate milestones!
        if ([3, 7, 14, 30, 50, 100].includes(newStreak.currentStreak)) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        setIsAnimating(true)
      } else {
        // Streak broken, start fresh
        const newStreak: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setIsAnimating(true)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        lessonsViewed: 0,
      }
      setStreak(newStreak)
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setIsAnimating(true)
    }
  }, [])

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '⚡'
    if (count >= 7) return '🔥'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number): string => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'On fire! 2 weeks strong!'
    if (count >= 7) return 'One week streak!'
    if (count >= 3) return 'Building momentum!'
    if (count === 1) return 'Great start!'
    return 'Keep learning!'
  }

  const getFlameIntensity = (count: number): string => {
    if (count >= 14) return 'animate-pulse'
    if (count >= 7) return 'animate-bounce'
    return ''
  }

  return (
    <>
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Streak card */}
      <div className={`card p-6 relative overflow-hidden ${isAnimating ? 'animate-streak-pop' : ''}`}>
        {/* Background gradient glow */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-orange-500/10 opacity-50"
          style={{ filter: 'blur(20px)' }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className={`text-2xl ${getFlameIntensity(streak.currentStreak)}`}>
                {getStreakEmoji(streak.currentStreak)}
              </span>
              Learning Streak
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(streak.currentStreak, 7))].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
              {streak.currentStreak}
            </span>
            <span className="text-navy-400 text-lg">
              {streak.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          <p className="text-navy-300 mb-4">{getStreakMessage(streak.currentStreak)}</p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-800">
            <div>
              <div className="text-2xl font-bold text-white">{streak.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{streak.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}