'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day visit
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(newStreak, data.longestStreak)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }

    // Start animation loop
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return "You're a learning legend!"
    if (streak >= 14) return "Two weeks strong!"
    if (streak >= 7) return "One week streak!"
    if (streak >= 3) return "Building momentum!"
    return "Great start!"
  }

  return (
    <div className="relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="animate-bounce text-2xl">🎉</span>
        </div>
      )}
      
      <div className={`
        card p-4 sm:p-6 
        bg-gradient-to-br from-orange-500/10 via-navy-900/50 to-red-500/10
        border-orange-500/20
        transition-all duration-500
        ${isAnimating ? 'shadow-lg shadow-orange-500/20' : 'shadow-md shadow-orange-500/10'}
      `}>
        <div className="flex items-center gap-4">
          {/* Animated fire icon */}
          <div className={`
            text-4xl sm:text-5xl 
            transition-transform duration-300
            ${isAnimating ? 'scale-110' : 'scale-100'}
          `}>
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {streakData.currentStreak}
              </span>
              <span className="text-navy-400 text-sm">
                day{streakData.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-orange-400 text-sm font-medium">
              {getStreakMessage(streakData.currentStreak)}
            </p>
          </div>

          {/* Best streak badge */}
          {streakData.longestStreak > 1 && (
            <div className="text-right hidden sm:block">
              <div className="text-xs text-navy-500 uppercase tracking-wide">Best</div>
              <div className="text-lg font-semibold text-navy-300">
                {streakData.longestStreak} 🏆
              </div>
            </div>
          )}
        </div>

        {/* Progress bar to next milestone */}
        {streakData.currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-500 mb-1">
              <span>Progress to next milestone</span>
              <span>{getNextMilestone(streakData.currentStreak)} days</span>
            </div>
            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30]
  for (const milestone of milestones) {
    if (current < milestone) return milestone
  }
  return 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [3, 7, 14, 30]
  let prevMilestone = 0
  
  for (const milestone of milestones) {
    if (current < milestone) {
      const progress = ((current - prevMilestone) / (milestone - prevMilestone)) * 100
      return Math.min(100, Math.max(0, progress))
    }
    prevMilestone = milestone
  }
  
  return 100
}