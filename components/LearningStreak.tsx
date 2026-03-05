'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get stored streak data
    const storedStreak = localStorage.getItem('learning-streak')
    const storedLastVisit = localStorage.getItem('learning-last-visit')
    const today = new Date().toDateString()

    if (storedLastVisit) {
      const lastDate = new Date(storedLastVisit)
      const currentDate = new Date()
      const diffTime = currentDate.getTime() - lastDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(parseInt(storedStreak || '1'))
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = parseInt(storedStreak || '0') + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        localStorage.setItem('learning-last-visit', today)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        localStorage.setItem('learning-last-visit', today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('learning-last-visit', today)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }

    setLastVisit(today)
  }, [])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Legendary! You're unstoppable!"
    if (streak >= 14) return "🔥 Two weeks strong! Amazing!"
    if (streak >= 7) return "⭐ One week streak! Keep going!"
    if (streak >= 3) return "🚀 You're building momentum!"
    return "💪 Great start! Come back tomorrow!"
  }

  const getStreakEmoji = () => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '🚀'
    return '✨'
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-50'}`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
          <span className={`text-3xl transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
            {getStreakEmoji()}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
            {streak}
          </span>
          <span className="text-navy-400 text-lg">day{streak !== 1 ? 's' : ''}</span>
        </div>
        
        <p className="text-navy-300 text-sm">{getStreakMessage()}</p>
        
        {/* Streak progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-navy-500 mb-1">
            <span>Progress to next milestone</span>
            <span>{streak % 7}/7 days</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${((streak % 7) / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}