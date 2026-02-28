'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalLessonsCompleted: number
  completedLessons: string[]
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastLearningDate: null,
  totalLessonsCompleted: 0,
  completedLessons: [],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StreakData
        const today = new Date().toDateString()
        const lastDate = parsed.lastLearningDate

        // Check if streak should be reset (missed more than 1 day)
        if (lastDate) {
          const lastLearningDate = new Date(lastDate)
          const daysSinceLastLearning = Math.floor(
            (new Date().getTime() - lastLearningDate.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (daysSinceLastLearning > 1) {
            // Reset streak but keep other data
            const updatedData = {
              ...parsed,
              currentStreak: 0,
            }
            setStreakData(updatedData)
            localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
          } else {
            setStreakData(parsed)
          }
        } else {
          setStreakData(parsed)
        }
      } catch {
        setStreakData(defaultStreakData)
      }
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '💤'
    if (streak < 3) return '🔥'
    if (streak < 7) return '⚡'
    if (streak < 14) return '🌟'
    if (streak < 30) return '💎'
    return '👑'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "Start your streak today!"
    if (streak === 1) return "Great start! Keep it going!"
    if (streak < 7) return "You're on fire!"
    if (streak < 14) return "Amazing dedication!"
    if (streak < 30) return "Incredible consistency!"
    return "Legendary learner!"
  }

  const getStreakColor = (streak: number): string => {
    if (streak === 0) return 'from-gray-500 to-gray-600'
    if (streak < 3) return 'from-orange-500 to-red-500'
    if (streak < 7) return 'from-yellow-500 to-orange-500'
    if (streak < 14) return 'from-green-500 to-emerald-500'
    if (streak < 30) return 'from-blue-500 to-purple-500'
    return 'from-purple-500 to-pink-500'
  }

  if (!isVisible) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-gradient-to-r ${getStreakColor(streakData.currentStreak)}
          text-white font-semibold text-sm
          shadow-lg cursor-pointer
          transition-all duration-300 hover:scale-105
          animate-pulse-slow
        `}
      >
        <span className="text-lg">{getStreakEmoji(streakData.currentStreak)}</span>
        <span>{streakData.currentStreak} day streak</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-2 right-0 z-50 w-64 p-4 bg-navy-800 border border-navy-700 rounded-xl shadow-xl">
          <div className="text-center mb-3">
            <div className="text-3xl mb-1">{getStreakEmoji(streakData.currentStreak)}</div>
            <div className="text-white font-semibold">{getStreakMessage(streakData.currentStreak)}</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-navy-300">
              <span>Current Streak</span>
              <span className="text-white font-medium">{streakData.currentStreak} days</span>
            </div>
            <div className="flex justify-between text-navy-300">
              <span>Longest Streak</span>
              <span className="text-white font-medium">{streakData.longestStreak} days</span>
            </div>
            <div className="flex justify-between text-navy-300">
              <span>Lessons Completed</span>
              <span className="text-white font-medium">{streakData.totalLessonsCompleted}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-navy-700 text-xs text-navy-400 text-center">
            Complete a lesson today to keep your streak! 🎯
          </div>
        </div>
      )}
    </div>
  )
}