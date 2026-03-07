'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simulate getting streak from localStorage (in a real app, this would be from a backend)
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // User already visited today
      setStreak(Number(savedStreak) || 1)
    } else if (lastVisit) {
      // Check if it's consecutive
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = (Number(savedStreak) || 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', String(newStreak))
        setIsAnimating(true)
      } else {
        // Streak broken
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }

    localStorage.setItem('last-visit-date', today)
  }, [])

  // Generate flame colors based on streak
  const getFlameColor = () => {
    if (streak >= 30) return 'from-purple-500 via-pink-500 to-red-500'
    if (streak >= 14) return 'from-orange-400 via-red-500 to-pink-500'
    if (streak >= 7) return 'from-yellow-400 via-orange-500 to-red-500'
    return 'from-yellow-300 via-orange-400 to-red-500'
  }

  return (
    <div 
      className={`inline-flex items-center gap-3 px-4 py-2 bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-full transition-all duration-500 ${
        isAnimating ? 'scale-110 border-orange-500/50' : ''
      }`}
    >
      <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
        <div 
          className={`w-8 h-8 bg-gradient-to-t ${getFlameColor()} rounded-full flex items-center justify-center`}
        >
          <span className="text-lg">🔥</span>
        </div>
        {streak >= 7 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        )}
      </div>
      <div className="text-sm">
        <div className="font-bold text-white">{streak} Day{streak !== 1 ? 's' : ''}</div>
        <div className="text-navy-400 text-xs">Learning Streak</div>
      </div>
      {streak >= 7 && (
        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 rounded-full">
          🏆 On Fire!
        </span>
      )}
    </div>
  )
}