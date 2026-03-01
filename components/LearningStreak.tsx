'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDays: number
  lastVisit: string
  weekActivity: boolean[]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak!
        const newData: StreakData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          totalDays: data.totalDays + 1,
          lastVisit: today,
          weekActivity: [...data.weekActivity.slice(1), true]
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Trigger confetti for milestone streaks
        if (newData.currentStreak % 7 === 0 || newData.currentStreak === 1) {
          setTimeout(() => setShowConfetti(true), 500)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          totalDays: data.totalDays + 1,
          lastVisit: today,
          weekActivity: [...data.weekActivity.slice(1), true]
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        lastVisit: today,
        weekActivity: [false, false, false, false, false, false, true]
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setTimeout(() => setShowConfetti(true), 500)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg" />
      </div>
    )
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const motivationalMessages = [
    "You're on fire! 🔥",
    "Keep up the great work! 💪",
    "Learning champion! 🏆",
    "Unstoppable! 🚀",
    "Brilliant progress! ⭐"
  ]
  const randomMessage = motivationalMessages[streakData.currentStreak % motivationalMessages.length]

  return (
    <div 
      className="card p-6 relative overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/5 to-green-500/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`text-5xl transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'}
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400">day streak</span>
              </div>
              <p className="text-sm text-primary-400 font-medium">{randomMessage}</p>
            </div>
          </div>

          {/* Week Activity */}
          <div className="flex flex-col items-start md:items-center gap-2">
            <span className="text-xs text-navy-500 uppercase tracking-wider">This Week</span>
            <div className="flex gap-2">
              {streakData.weekActivity.map((active, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-br from-primary-500 to-green-500 text-white shadow-lg shadow-primary-500/25' 
                        : 'bg-navy-800 text-navy-500'
                    } ${index === 6 ? 'ring-2 ring-primary-400/50' : ''}`}
                  >
                    {active ? '✓' : dayLabels[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.totalDays}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}