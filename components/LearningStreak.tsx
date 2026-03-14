'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const storedStreak = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let streakData: StreakData
    
    if (storedStreak) {
      streakData = JSON.parse(storedStreak)
      const lastVisit = new Date(streakData.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === today) {
        // Already visited today, keep streak
        setStreak(streakData)
      } else if (lastVisit === yesterday.toDateString()) {
        // Visited yesterday, increment streak!
        const newStreak = {
          currentStreak: streakData.currentStreak + 1,
          lastVisit: today,
          totalDays: streakData.totalDays + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        // Show confetti for milestone streaks
        if (newStreak.currentStreak % 5 === 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newStreak = {
          currentStreak: 1,
          lastVisit: today,
          totalDays: streakData.totalDays + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit ever
      streakData = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(streakData))
      setStreak(streakData)
    }
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!streak) return null

  const getStreakMessage = () => {
    if (streak.currentStreak >= 30) return "Legendary! You're unstoppable! 🏆"
    if (streak.currentStreak >= 14) return "Two weeks strong! Amazing! 💪"
    if (streak.currentStreak >= 7) return "One week streak! Keep it up! 🔥"
    if (streak.currentStreak >= 3) return "You're building momentum! ⚡"
    if (streak.currentStreak === 1) return "Welcome back! Let's learn! 👋"
    return "Great progress! Keep going! 🚀"
  }

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 30) return '🏆'
    if (streak.currentStreak >= 14) return '💎'
    if (streak.currentStreak >= 7) return '🔥'
    if (streak.currentStreak >= 3) return '⚡'
    return '✨'
  }

  return (
    <>
      {/* Confetti effect for milestones */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      <div 
        className={`inline-flex items-center gap-3 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-2 mb-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">{getStreakEmoji()}</span>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">
              {streak.currentStreak} Day Streak!
            </span>
            <span className="text-navy-400 text-xs">
              {getStreakMessage()}
            </span>
          </div>
        </div>
        
        {/* Streak fire visualization */}
        <div className="flex gap-0.5">
          {[...Array(Math.min(streak.currentStreak, 7))].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-4 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full animate-flicker"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </>
  )
}