'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check and update streak from localStorage
    const storedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Already visited today, just show the streak
      setStreak(storedStreak ? parseInt(storedStreak, 10) : 1)
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Visited yesterday, increment streak
        const newStreak = (storedStreak ? parseInt(storedStreak, 10) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', String(newStreak))
        
        // Show celebration for milestones
        if (newStreak % 7 === 0 || newStreak === 3 || newStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }

    localStorage.setItem('last-visit-date', today)
    
    // Delay showing for animation
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    return 'Welcome back!'
  }

  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-full animate-fade-in">
      {/* Celebration effect */}
      {showCelebration && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 animate-ping bg-primary-400/30 rounded-full" />
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-lg animate-celebration"
              style={{
                left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 60}%`,
                top: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 60}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊', '💫'][i]}
            </span>
          ))}
        </div>
      )}
      
      <span className="text-xl animate-bounce-slow">{getStreakEmoji()}</span>
      <div className="flex flex-col items-start">
        <span className="text-primary-300 font-semibold text-sm">
          {streak} Day{streak !== 1 ? 's' : ''} Streak
        </span>
        <span className="text-primary-400/70 text-xs">{getStreakMessage()}</span>
      </div>
      
      {/* Progress dots for the week */}
      <div className="flex gap-1 ml-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < (streak % 7 === 0 && streak > 0 ? 7 : streak % 7)
                ? 'bg-primary-400 shadow-sm shadow-primary-400/50'
                : 'bg-navy-700'
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  )
}