'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDaysLearned: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFlame, setShowFlame] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (savedStreak) {
      const data: StreakData = JSON.parse(savedStreak)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
        setShowFlame(data.currentStreak >= 3)
      } else if (lastVisitDate === yesterday) {
        // Continuing streak!
        const newStreak = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setIsAnimating(true)
        setShowFlame(newStreak.currentStreak >= 3)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken 😢
        const newStreak = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      }
    } else {
      // First visit ever!
      const newStreak = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearned: 1,
      }
      setStreak(newStreak)
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return "Start your learning journey!"
    if (streak.currentStreak === 1) return "Great start! Come back tomorrow! 🌱"
    if (streak.currentStreak < 7) return "You're building momentum! 💪"
    if (streak.currentStreak < 30) return "Incredible dedication! 🔥"
    if (streak.currentStreak < 100) return "You're a learning machine! 🚀"
    return "Legendary learner! 👑"
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 border border-orange-500/30 p-6 transition-all duration-500 ${isAnimating ? 'scale-105' : ''}`}>
      {/* Animated background flames for high streaks */}
      {showFlame && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-4 left-1/4 w-8 h-16 bg-gradient-to-t from-orange-500/40 to-transparent rounded-full blur-sm animate-pulse" />
          <div className="absolute -bottom-4 left-1/2 w-10 h-20 bg-gradient-to-t from-red-500/40 to-transparent rounded-full blur-sm animate-pulse delay-100" />
          <div className="absolute -bottom-4 right-1/4 w-8 h-14 bg-gradient-to-t from-yellow-500/40 to-transparent rounded-full blur-sm animate-pulse delay-200" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
              {streak.currentStreak >= 7 ? '🔥' : streak.currentStreak >= 3 ? '⚡' : '✨'}
            </span>
            Daily Streak
          </h3>
          <div className="text-right">
            <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 ${isAnimating ? 'animate-pulse' : ''}`}>
              {streak.currentStreak}
            </div>
            <div className="text-xs text-navy-400">days</div>
          </div>
        </div>
        
        <p className="text-sm text-navy-300 mb-4">{getStreakMessage()}</p>
        
        {/* Streak visualization */}
        <div className="flex gap-1 mb-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < streak.currentStreak % 7 || (streak.currentStreak >= 7 && streak.currentStreak % 7 === 0 && i < 7)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-navy-700'
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-navy-400">
          <span>🏆 Best: {streak.longestStreak} days</span>
          <span>📚 Total: {streak.totalDaysLearned} days</span>
        </div>
      </div>
    </div>
  )
}