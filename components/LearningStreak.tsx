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
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learnhub-streak')
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Continuing streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        // Streak broken, starting fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsNewStreak(true)
    }
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-navy-700 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 5],
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            🔥 Learning Streak
            {isNewStreak && (
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full animate-pulse">
                +1 day!
              </span>
            )}
          </h3>
          <p className="text-navy-400 text-sm">Keep your momentum going!</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white flex items-center gap-2">
            <span className={`${streakData.currentStreak >= 7 ? 'text-primary-400' : ''}`}>
              {streakData.currentStreak}
            </span>
            <span className="text-navy-500 text-lg font-normal">days</span>
          </div>
        </div>
      </div>

      {/* Streak Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-navy-400 mb-2">
          <span>Weekly Goal</span>
          <span>{Math.min(streakData.currentStreak, 7)}/7 days</span>
        </div>
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((streakData.currentStreak / 7) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-navy-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Best Streak</div>
        </div>
        <div className="bg-navy-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
          <div className="text-xs text-navy-400">Total Visits</div>
        </div>
      </div>

      {/* Motivational Message */}
      {streakData.currentStreak >= 7 && (
        <div className="mt-4 bg-primary-500/10 border border-primary-500/20 rounded-lg p-3 text-center">
          <span className="text-primary-400 text-sm">
            🎉 Amazing! You&apos;ve been learning for a full week!
          </span>
        </div>
      )}
      {streakData.currentStreak >= 30 && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
          <span className="text-yellow-400 text-sm">
            ⭐ Incredible! 30-day streak! You&apos;re a learning machine!
          </span>
        </div>
      )}
    </div>
  )
}