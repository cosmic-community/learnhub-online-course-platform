'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const streakData = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (streakData) {
      const currentStreak = parseInt(streakData, 10)
      
      if (lastVisit === today) {
        // Already visited today, show current streak
        setStreak(currentStreak)
      } else if (lastVisit) {
        // Check if it was yesterday
        const lastDate = new Date(lastVisit)
        const todayDate = new Date(today)
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Consecutive day! Increment streak
          const newStreak = currentStreak + 1
          setStreak(newStreak)
          localStorage.setItem('learning-streak', newStreak.toString())
          localStorage.setItem('last-visit-date', today)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        } else {
          // Streak broken, reset to 1
          setStreak(1)
          localStorage.setItem('learning-streak', '1')
          localStorage.setItem('last-visit-date', today)
        }
      }
    } else {
      // First time visitor
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-visit-date', today)
    }

    // Trigger animation after mount
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  if (streak === 0) return null

  return (
    <div className="mb-8 relative">
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-celebration"
              style={{
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {['🎉', '✨', '🔥', '⭐', '🎊', '💫'][i % 6]}
            </span>
          ))}
        </div>
      )}
      
      <div
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 transition-all duration-700 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="text-3xl animate-bounce-slow">🔥</span>
        <div className="text-left">
          <div className="text-orange-400 font-bold text-lg">
            {streak} Day{streak !== 1 ? 's' : ''} Streak!
          </div>
          <div className="text-orange-300/70 text-sm">
            {streak === 1 
              ? "Great start! Come back tomorrow!" 
              : streak < 7 
                ? "Keep it up! You're on fire!" 
                : streak < 30 
                  ? "Amazing dedication! 🌟" 
                  : "You're a learning legend! 🏆"}
          </div>
        </div>
        {streak >= 7 && (
          <span className="text-2xl ml-2">
            {streak >= 30 ? '🏆' : streak >= 14 ? '🌟' : '⚡'}
          </span>
        )}
      </div>
    </div>
  )
}