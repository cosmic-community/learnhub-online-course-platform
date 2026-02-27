'use client'

import { useState, useEffect } from 'react'

const motivationalMessages = [
  "You're on fire! 🔥",
  "Keep the momentum going! 🚀",
  "Learning champions never stop! 🏆",
  "Your future self will thank you! 💪",
  "Every expert was once a beginner! ⭐",
  "Consistency is the key to mastery! 🔑",
  "You're building something amazing! 🌟",
  "Small steps lead to big achievements! 🎯"
]

export default function DailyStreak() {
  const [streak, setStreak] = useState(0)
  const [message, setMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simulate streak from localStorage (in real app, this would be from user data)
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Already visited today
      setStreak(parseInt(savedStreak || '1'))
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        // Continued streak
        const newStreak = parseInt(savedStreak || '0') + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        setIsAnimating(true)
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
    }

    localStorage.setItem('lastVisitDate', today)
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-navy-900/50 rounded-2xl p-6 border border-primary-500/20">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Streak fire icon with animation */}
          <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className="text-5xl filter drop-shadow-lg">
              {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨'}
            </div>
            {streak >= 7 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping" />
            )}
          </div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent ${isAnimating ? 'animate-pulse' : ''}`}>
                {streak}
              </span>
              <span className="text-navy-300 text-lg">day streak</span>
            </div>
            <p className="text-primary-400 text-sm mt-1">{message}</p>
          </div>
        </div>

        {/* Progress rings */}
        <div className="hidden sm:flex items-center gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < streak
                  ? 'bg-primary-500 shadow-lg shadow-primary-500/50'
                  : 'bg-navy-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Achievement badge for milestones */}
      {streak >= 7 && (
        <div className="mt-4 pt-4 border-t border-primary-500/20">
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
              🏆 WEEK WARRIOR
            </span>
            <span className="text-navy-400">You've been learning for a whole week!</span>
          </div>
        </div>
      )}
    </div>
  )
}