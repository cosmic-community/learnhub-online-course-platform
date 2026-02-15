'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub_streak') || '0', 10)
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Same day, keep streak
      setStreak(currentStreak)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day! Increase streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub_streak', newStreak.toString())
        if (newStreak > 1) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learnhub_streak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub_streak', '1')
    }

    localStorage.setItem('learnhub_last_visit', today)
    
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (streak === 0) return null

  return (
    <div 
      className={`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gradient-to-r from-amber-500/20 to-orange-500/20
        border border-amber-500/30 rounded-full
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
      `}
    >
      {/* Fire emoji with animation */}
      <span className={`text-xl ${streak >= 7 ? 'animate-bounce' : ''}`}>
        {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨'}
      </span>
      
      <span className="text-sm font-medium text-amber-200">
        {streak} day{streak !== 1 ? 's' : ''} learning streak!
      </span>

      {/* Confetti effect for streak milestones */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-lg animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s',
              }}
            >
              {['🎉', '⭐', '✨', '🌟'][Math.floor(Math.random() * 4)]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}