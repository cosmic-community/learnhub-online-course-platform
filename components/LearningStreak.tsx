'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  className?: string
}

export default function LearningStreak({ className = '' }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Get stored streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    if (storedData) {
      const data = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisit)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day visit
        setStreak(data.streak)
      } else if (diffDays === 1) {
        // Consecutive day - increment streak!
        const newStreak = data.streak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          streak: newStreak,
          lastVisit: today.toISOString()
        }))
        // Show celebration for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 1) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          streak: 1,
          lastVisit: today.toISOString()
        }))
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub-streak', JSON.stringify({
        streak: 1,
        lastVisit: new Date().toISOString()
      }))
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl px-4 py-3">
        <div className="relative">
          <span className="text-3xl animate-pulse">🔥</span>
          {showCelebration && (
            <div className="absolute -top-2 -right-2 flex">
              <span className="animate-bounce text-lg">✨</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-sm text-orange-300 font-medium">Learning Streak</div>
          <div className="text-2xl font-bold text-white">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
        {streak >= 7 && (
          <div className="ml-auto">
            <span className="badge bg-yellow-500/30 text-yellow-300 text-xs">
              🏆 On Fire!
            </span>
          </div>
        )}
      </div>
      
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <div className="absolute top-0 left-1/4 animate-float-up">🎉</div>
          <div className="absolute top-0 left-1/2 animate-float-up delay-100">⭐</div>
          <div className="absolute top-0 left-3/4 animate-float-up delay-200">🎊</div>
        </div>
      )}
    </div>
  )
}