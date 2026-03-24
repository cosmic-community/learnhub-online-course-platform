'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Get stored streak data
    const storedData = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let streakData: StreakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastVisit: today,
      totalVisits: 1
    }

    if (storedData) {
      const parsed = JSON.parse(storedData) as StreakData
      const lastVisit = new Date(parsed.lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day visit
        streakData = parsed
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak = parsed.currentStreak + 1
        streakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, parsed.longestStreak),
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1
        }
        // Show celebration for streak milestones
        if (newStreak % 5 === 0 || newStreak === 3 || newStreak === 7) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken
        streakData = {
          currentStreak: 1,
          longestStreak: parsed.longestStreak,
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1
        }
      }
    }

    localStorage.setItem('learning-streak', JSON.stringify(streakData))
    setStreak(streakData)
  }, [])

  if (!streak) return null

  const getStreakMessage = () => {
    if (streak.currentStreak >= 30) return "🏆 Legendary learner!"
    if (streak.currentStreak >= 14) return "🌟 You're on fire!"
    if (streak.currentStreak >= 7) return "💪 One week strong!"
    if (streak.currentStreak >= 3) return "🔥 Keep it up!"
    return "👋 Welcome back!"
  }

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 30) return "🏆"
    if (streak.currentStreak >= 14) return "⭐"
    if (streak.currentStreak >= 7) return "🔥"
    if (streak.currentStreak >= 3) return "✨"
    return "🌱"
  }

  return (
    <div className="mb-8 relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -top-20 -left-20 -right-20">
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary-500/20 to-primary-600/10 rounded-full border border-primary-500/30 backdrop-blur-sm animate-pulse-subtle">
        <span className="text-2xl animate-bounce-subtle">{getStreakEmoji()}</span>
        <div className="text-left">
          <div className="text-primary-400 font-semibold">
            {streak.currentStreak} Day Streak!
          </div>
          <div className="text-navy-400 text-xs">
            {getStreakMessage()}
          </div>
        </div>
        {streak.currentStreak >= 3 && (
          <div className="flex items-center gap-1 ml-2">
            {[...Array(Math.min(streak.currentStreak, 7))].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
            {streak.currentStreak > 7 && (
              <span className="text-primary-400 text-xs ml-1">+{streak.currentStreak - 7}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}