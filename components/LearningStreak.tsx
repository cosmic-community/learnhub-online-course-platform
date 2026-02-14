'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  className?: string
}

export default function LearningStreak({ className = '' }: LearningStreakProps) {
  const [streakDays, setStreakDays] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate fetching streak from localStorage or API
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreakDays(savedStreak ? parseInt(savedStreak, 10) : 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = (savedStreak ? parseInt(savedStreak, 10) : 0) + 1
        setStreakDays(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken - reset
        setStreakDays(1)
        localStorage.setItem('learningStreak', '1')
      }
    } else {
      // First visit
      setStreakDays(1)
      localStorage.setItem('learningStreak', '1')
    }
    
    localStorage.setItem('lastVisitDate', today)
  }, [])

  if (!mounted) return null

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30 ${className}`}>
      <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
        🔥
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-orange-300 uppercase tracking-wide">Learning Streak</span>
        <span className="text-lg font-bold text-white">
          {streakDays} {streakDays === 1 ? 'day' : 'days'}
        </span>
      </div>
      {streakDays >= 7 && (
        <span className="ml-2 text-yellow-400 animate-pulse">⭐</span>
      )}
    </div>
  )
}