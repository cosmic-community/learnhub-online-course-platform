'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  todayLearned: boolean
  totalLessonsViewed: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreak = () => {
      const stored = localStorage.getItem('learning-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastVisitDate === today) {
          // Already visited today
          setStreak(data)
        } else if (lastVisitDate === yesterday) {
          // Visited yesterday, streak continues
          const newStreak: StreakData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastVisit: today,
            todayLearned: true,
          }
          localStorage.setItem('learning-streak', JSON.stringify(newStreak))
          setStreak(newStreak)
        } else {
          // Streak broken
          const newStreak: StreakData = {
            ...data,
            currentStreak: 1,
            lastVisit: today,
            todayLearned: true,
          }
          localStorage.setItem('learning-streak', JSON.stringify(newStreak))
          setStreak(newStreak)
        }
      } else {
        // First visit
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          todayLearned: true,
          totalLessonsViewed: 0,
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    }

    loadStreak()
    setIsVisible(true)
  }, [])

  if (!streak || !isVisible) return null

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '⚡'
    if (count >= 7) return '🔥'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number): string => {
    if (count >= 30) return "You're a learning champion!"
    if (count >= 14) return 'Two weeks strong!'
    if (count >= 7) return "One week streak! You're on fire!"
    if (count >= 3) return 'Building momentum!'
    return 'Every journey begins with a single step!'
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300"
        aria-label={`Learning streak: ${streak.currentStreak} days`}
      >
        <span className="text-lg">{getStreakEmoji(streak.currentStreak)}</span>
        <span className="text-white font-bold">{streak.currentStreak}</span>
        <span className="text-orange-300 text-sm hidden sm:inline">day{streak.currentStreak !== 1 ? 's' : ''}</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-center mb-3">
            <div className="text-3xl mb-1">{getStreakEmoji(streak.currentStreak)}</div>
            <p className="text-white font-semibold">{getStreakMessage(streak.currentStreak)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-navy-800 rounded-lg p-2">
              <div className="text-xl font-bold text-orange-400">{streak.currentStreak}</div>
              <div className="text-xs text-navy-400">Current</div>
            </div>
            <div className="bg-navy-800 rounded-lg p-2">
              <div className="text-xl font-bold text-primary-400">{streak.longestStreak}</div>
              <div className="text-xs text-navy-400">Best</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < Math.min(streak.currentStreak, 7)
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-center text-navy-500 mt-2">Keep learning daily!</p>
        </div>
      )}
    </div>
  )
}