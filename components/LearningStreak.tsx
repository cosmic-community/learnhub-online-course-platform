'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  totalVisits: 0,
  lessonsViewed: 0,
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Celebrate milestones
        if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak % 50 === 0) {
          setShowCelebration(true)
          setIsNewStreak(true)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        lessonsViewed: 0,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setIsNewStreak(true)
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#14b8a6', '#2dd4bf', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-navy-900/95 backdrop-blur-lg border border-primary-500/50 rounded-2xl p-8 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
              <div className="text-6xl mb-4">{getStreakEmoji(streakData.currentStreak)}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {streakData.currentStreak} Day Streak!
              </h3>
              <p className="text-primary-400 mb-4">{getStreakMessage(streakData.currentStreak)}</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="btn-primary"
              >
                Keep Learning!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-2 shadow-lg">
        <span className="text-2xl animate-pulse-slow">{getStreakEmoji(streakData.currentStreak)}</span>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">
            {streakData.currentStreak} day streak
          </span>
          <span className="text-navy-400 text-xs">
            {getStreakMessage(streakData.currentStreak)}
          </span>
        </div>
        {isNewStreak && (
          <span className="bg-primary-500/20 text-primary-400 text-xs px-2 py-0.5 rounded-full animate-pulse">
            +1
          </span>
        )}
      </div>
    </>
  )
}