'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  
  useEffect(() => {
    // Simulate loading streak from localStorage or API
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      // Already visited today, show existing streak
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else if (lastVisit) {
      // Check if yesterday
      const lastDate = new Date(lastVisit)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Consecutive day! Increment streak
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        setIsAnimating(true)
        
        // Show fireworks for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 1) {
          setShowFireworks(true)
          setTimeout(() => setShowFireworks(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
      setIsAnimating(true)
    }
    
    localStorage.setItem('lastVisitDate', today)
  }, [])
  
  const getStreakMessage = (days: number): string => {
    if (days >= 30) return "You're a legend! 🏆"
    if (days >= 14) return "Two weeks strong! 💪"
    if (days >= 7) return "One week champion! 🎯"
    if (days >= 3) return "Building momentum! 🔥"
    if (days === 1) return "Great start! Keep going! ✨"
    return "Welcome back! 👋"
  }
  
  const getFlameSize = (days: number): string => {
    if (days >= 30) return "text-5xl"
    if (days >= 14) return "text-4xl"
    if (days >= 7) return "text-3xl"
    return "text-2xl"
  }

  return (
    <div className="mb-8 relative">
      {/* Fireworks effect */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="firework firework-1" />
          <div className="firework firework-2" />
          <div className="firework firework-3" />
        </div>
      )}
      
      <div className={`inline-flex items-center gap-3 px-6 py-3 bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-full transition-all duration-500 ${isAnimating ? 'animate-celebrate scale-110' : ''}`}>
        <span className={`${getFlameSize(streak)} ${streak >= 3 ? 'animate-flame' : ''}`}>
          🔥
        </span>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-navy-400 text-sm">day streak</span>
          </div>
          <p className="text-xs text-primary-400">{getStreakMessage(streak)}</p>
        </div>
      </div>
    </div>
  )
}