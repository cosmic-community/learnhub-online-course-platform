'use client'

import { useState, useEffect } from 'react'

export default function LearningStreakBanner() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check/update learning streak
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0')
    const today = new Date().toDateString()

    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak: number
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak
        newStreak = currentStreak + 1
        if (newStreak > 0 && newStreak % 7 === 0) {
          // Celebrate weekly milestones!
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else if (!lastVisit) {
        // First visit
        newStreak = 1
      } else {
        // Streak broken - reset
        newStreak = 1
      }
      
      localStorage.setItem('learnhub-streak', newStreak.toString())
      localStorage.setItem('learnhub-last-visit', today)
      setStreak(newStreak)
    } else {
      setStreak(currentStreak)
    }
    
    setIsVisible(true)
  }, [])

  if (!isVisible || streak === 0) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-primary-500/20 border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-2xl animate-bounce">🔥</span>
            <span className="text-white font-medium">
              {streak === 1 
                ? "You started your learning streak today!" 
                : `${streak} day learning streak! Keep it up!`
              }
            </span>
            {streak >= 7 && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                🏆 Weekly Champion
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}