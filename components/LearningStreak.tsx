'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check localStorage for streak data
    const storedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Already visited today, keep current streak
      setStreak(storedStreak ? parseInt(storedStreak) : 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day - increment streak!
        const newStreak = (storedStreak ? parseInt(storedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        setShowConfetti(true)
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
      }
    } else {
      // First visit ever
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
      setShowConfetti(true)
    }

    localStorage.setItem('lastVisitDate', today)
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
    
    // Hide confetti after animation
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'You\'re on fire!'
    if (streak >= 7) return 'Amazing dedication!'
    if (streak >= 3) return 'Keep it up!'
    return 'Great start!'
  }

  return (
    <div className={`mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Streak badge */}
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-navy-700/50 rounded-full shadow-lg hover:shadow-primary-500/10 transition-all duration-300 hover:scale-105 cursor-default group">
        <span className="text-2xl animate-bounce-subtle">{getStreakEmoji()}</span>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-navy-400 text-sm">day{streak !== 1 ? 's' : ''} streak</span>
          </div>
          <p className="text-xs text-primary-400 group-hover:text-primary-300 transition-colors">
            {getStreakMessage()}
          </p>
        </div>
      </div>
    </div>
  )
}