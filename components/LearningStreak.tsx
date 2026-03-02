'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisit === yesterdayStr) {
        // Visited yesterday - increment streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreak(newData)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreak(newData)
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreak(newData)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '💎'
    if (count >= 7) return '🔥'
    if (count >= 3) return '⭐'
    return '✨'
  }

  const getStreakMessage = (count: number) => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'Unstoppable!'
    if (count >= 7) return 'On fire!'
    if (count >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div 
      className="relative inline-flex items-center gap-2 mb-6"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`
          inline-flex items-center gap-2 px-4 py-2 
          bg-gradient-to-r from-orange-500/20 to-yellow-500/20 
          border border-orange-500/30 rounded-full
          cursor-pointer transition-all duration-300
          ${isAnimating ? 'scale-110 shadow-lg shadow-orange-500/30' : 'hover:scale-105'}
        `}
      >
        <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
          {getStreakEmoji(streak.currentStreak)}
        </span>
        <span className="text-orange-300 font-semibold">
          {streak.currentStreak} day streak
        </span>
        <span className="text-orange-400/60 text-sm">
          {getStreakMessage(streak.currentStreak)}
        </span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-4 shadow-xl min-w-[200px]">
            <div className="text-center">
              <p className="text-white font-medium mb-2">Your Learning Stats</p>
              <div className="space-y-1 text-sm">
                <p className="text-navy-300">
                  🔥 Current Streak: <span className="text-orange-400 font-semibold">{streak.currentStreak} days</span>
                </p>
                <p className="text-navy-300">
                  🏆 Longest Streak: <span className="text-yellow-400 font-semibold">{streak.longestStreak} days</span>
                </p>
                <p className="text-navy-300">
                  📚 Total Visits: <span className="text-primary-400 font-semibold">{streak.totalVisits}</span>
                </p>
              </div>
              <p className="text-navy-500 text-xs mt-2">Keep learning daily!</p>
            </div>
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-800 border-l border-t border-navy-700 rotate-45" />
          </div>
        </div>
      )}
    </div>
  )
}