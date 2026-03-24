'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Check and update streak from localStorage
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      // Already visited today
      setStreak(currentStreak)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
      
      localStorage.setItem('learnhub-last-visit', today)
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Legendary learner!"
    if (streak >= 14) return "🔥 You're on fire!"
    if (streak >= 7) return "⭐ One week strong!"
    if (streak >= 3) return "🌟 Keep it up!"
    return "👋 Welcome back!"
  }

  const getStreakColor = () => {
    if (streak >= 30) return 'from-yellow-500 to-orange-500'
    if (streak >= 14) return 'from-orange-500 to-red-500'
    if (streak >= 7) return 'from-primary-500 to-purple-500'
    return 'from-primary-400 to-primary-600'
  }

  if (!isVisible) return null

  return (
    <div 
      className="relative inline-flex items-center gap-3 px-4 py-2 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-full animate-bounce-in cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Glow effect for high streaks */}
      {streak >= 7 && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getStreakColor()} opacity-20 blur-md animate-streak-glow`} />
      )}
      
      <div className="relative flex items-center gap-3">
        {/* Fire emoji with animation */}
        <span className={`text-2xl ${streak >= 3 ? 'animate-float' : ''}`}>
          {streak >= 7 ? '🔥' : streak >= 3 ? '✨' : '📚'}
        </span>
        
        {/* Streak counter */}
        <div className="flex flex-col">
          <span className={`text-lg font-bold bg-gradient-to-r ${getStreakColor()} bg-clip-text text-transparent`}>
            {streak} day{streak !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-navy-400">
            Learning streak
          </span>
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-navy-700 border border-navy-600 rounded-lg text-sm text-white whitespace-nowrap animate-fade-in-up z-10">
          {getStreakMessage()}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-700 border-l border-t border-navy-600 rotate-45" />
        </div>
      )}
    </div>
  )
}