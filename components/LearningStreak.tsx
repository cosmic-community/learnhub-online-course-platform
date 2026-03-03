'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learning-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
    const todayDate = new Date(today)

    if (data.lastVisit !== today) {
      // Check if it's a consecutive day
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day!
          data.currentStreak += 1
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
            // Check for milestone celebrations
            if ([3, 7, 14, 30, 50, 100].includes(data.currentStreak)) {
              setIsNewMilestone(true)
              setShowCelebration(true)
            }
          }
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit ever
        data.currentStreak = 1
      }
      
      data.lastVisit = today
      data.totalVisits += 1
      localStorage.setItem('learning-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '👑'
    if (streak >= 50) return '🏆'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🌟'
    if (streak >= 3) return '✨'
    return '🎯'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 30) return "You're unstoppable!"
    if (streak >= 14) return "Two weeks strong!"
    if (streak >= 7) return "One week streak!"
    if (streak >= 3) return "Building momentum!"
    if (streak === 1) return "Great start!"
    return "Keep learning!"
  }

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
          {isNewMilestone && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-primary-500 to-purple-500 px-6 py-3 rounded-2xl shadow-2xl">
                {streakData.currentStreak} Day Streak!
              </div>
            </div>
          )}
        </div>
      )}

      {/* Streak Widget */}
      <div className="card p-4 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-navy-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#streak-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(streakData.currentStreak / 30 * 176, 176)} 176`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {getStreakEmoji(streakData.currentStreak)}
            </div>
          </div>

          {/* Streak Info */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400 text-sm">day streak</span>
            </div>
            <p className="text-primary-400 text-sm font-medium">
              {getMotivationalMessage(streakData.currentStreak)}
            </p>
            <div className="flex gap-4 mt-1 text-xs text-navy-500">
              <span>Best: {streakData.longestStreak} days</span>
              <span>•</span>
              <span>{streakData.totalVisits} total visits</span>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => setShowCelebration(true)}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors text-navy-400 hover:text-primary-400"
            title="Celebrate!"
          >
            🎊
          </button>
        </div>
      </div>
    </>
  )
}