'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDays: 0
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learningStreak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, continue streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDays: data.totalDays + 1
        }
        localStorage.setItem('learningStreak', JSON.stringify(newData))
        setStreakData(newData)
        setIsAnimating(true)
        
        // Show celebration for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1
        }
        localStorage.setItem('learningStreak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1
      }
      localStorage.setItem('learningStreak', JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '💪'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'One week milestone!'
    if (streak >= 3) return 'Building momentum!'
    if (streak === 1) return 'Great start!'
    return 'Keep going!'
  }

  return (
    <div className={`card p-6 relative overflow-hidden ${isAnimating ? 'animate-pulse-once' : ''}`}>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-yellow-500/20 to-primary-500/20 animate-shimmer z-10 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">🎉</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div className={`text-5xl transition-transform duration-500 ${isAnimating ? 'scale-125' : ''}`}>
          {getStreakEmoji(streakData.currentStreak)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">Learning Streak</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-400">
              {streakData.currentStreak}
            </span>
            <span className="text-navy-400 text-sm">
              {streakData.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-navy-300 text-sm mt-1">{getStreakMessage(streakData.currentStreak)}</p>
        </div>
      </div>
      
      {/* Progress bar to next milestone */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-navy-400 mb-1">
          <span>Progress to next milestone</span>
          <span>{streakData.currentStreak % 7}/7 days</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((streakData.currentStreak % 7) / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 pt-4 border-t border-navy-800 flex justify-between text-sm">
        <div className="text-center">
          <div className="text-white font-semibold">{streakData.longestStreak}</div>
          <div className="text-navy-400 text-xs">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{streakData.totalDays}</div>
          <div className="text-navy-400 text-xs">Total Days</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{Math.floor(streakData.currentStreak / 7)}</div>
          <div className="text-navy-400 text-xs">Weeks</div>
        </div>
      </div>
    </div>
  )
}