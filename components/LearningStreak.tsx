'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has visited before and track streak
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
        // Visited yesterday, continue streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else if (!lastVisit) {
        // First visit
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, reset
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
      
      localStorage.setItem('learnhub-last-visit', today)
    }
  }, [])

  if (streak === 0) return null

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 ${isAnimating ? 'animate-bounce' : ''}`}>
      <span className="text-2xl">🔥</span>
      <span className="text-sm font-medium text-orange-300">
        {streak} day{streak !== 1 ? 's' : ''} learning streak!
      </span>
    </div>
  )
}