'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastVisitDate: string
  lessonsCompleted: number
  coursesStarted: number
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysLearned: 0,
  lastVisitDate: '',
  lessonsCompleted: 0,
  coursesStarted: 0,
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === today) {
        // Same day visit
        setStreakData(data)
      } else if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak!
        const newData: StreakData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          totalDaysLearned: data.totalDaysLearned + 1,
          lastVisitDate: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setShowCelebration(true)
        setIsNewDay(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken - reset but keep records
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          totalDaysLearned: data.totalDaysLearned + 1,
          lastVisitDate: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setIsNewDay(true)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        totalDaysLearned: 1,
        lastVisitDate: today,
        lessonsCompleted: 0,
        coursesStarted: 0,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowCelebration(true)
      setIsNewDay(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return "You're on fire!"
    if (streak >= 7) return 'Amazing dedication!'
    if (streak >= 3) return 'Keep it up!'
    return 'Great start!'
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">
            {streakData.currentStreak >= 7 ? '🎉' : '⭐'}
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full animate-ping"
                style={{
                  left: `${Math.cos((i * 30 * Math.PI) / 180) * 100}px`,
                  top: `${Math.sin((i * 30 * Math.PI) / 180) * 100}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Streak Card */}
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
            Learning Streak
          </h3>
          {isNewDay && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full animate-pulse">
              +1 Day!
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 tabular-nums">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400">Current</div>
          </div>
          <div className="text-center border-x border-navy-700">
            <div className="text-3xl font-bold text-white tabular-nums">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400">Best</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white tabular-nums">
              {streakData.totalDaysLearned}
            </div>
            <div className="text-xs text-navy-400">Total Days</div>
          </div>
        </div>

        <p className="text-sm text-primary-300 text-center font-medium">
          {getStreakMessage(streakData.currentStreak)}
        </p>

        {/* Weekly Progress Dots */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(7)].map((_, i) => {
            const dayDate = new Date()
            dayDate.setDate(dayDate.getDate() - (6 - i))
            const isActive = streakData.currentStreak > (6 - i)
            const isToday = i === 6
            
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-primary-500 text-white' 
                    : isToday 
                      ? 'bg-navy-700 text-navy-300 ring-2 ring-primary-500' 
                      : 'bg-navy-800 text-navy-500'
                }`}
                title={dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
              >
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayDate.getDay()]}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}