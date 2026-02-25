'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalMessages = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🔥" },
  { min: 3, max: 6, message: "You're building a habit! Amazing!", emoji: "⭐" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "🏆" },
  { min: 14, max: 29, message: "Two weeks! You're a dedicated learner!", emoji: "💪" },
  { min: 30, max: 59, message: "A month of learning! Incredible commitment!", emoji: "🎯" },
  { min: 60, max: 89, message: "Two months! You're in the top 1%!", emoji: "🌟" },
  { min: 90, max: Infinity, message: "Learning legend status achieved!", emoji: "👑" },
]

function getMotivationalMessage(streak: number) {
  const found = motivationalMessages.find(m => streak >= m.min && streak <= m.max)
  return found || motivationalMessages[0]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Already visited today, just show the data
        setStreakData(data)
      } else if (isYesterday(lastVisitDate, today)) {
        // Visited yesterday, increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today.toISOString(),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsAnimating(true)
        
        // Show confetti for milestone streaks
        if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today.toISOString(),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today.toISOString(),
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  if (!streakData) {
    return null
  }

  const { message, emoji } = getMotivationalMessage(streakData.currentStreak)
  const streakPercentage = Math.min((streakData.currentStreak / 30) * 100, 100)

  return (
    <div className="relative">
      {/* Confetti effect for milestones */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
      
      <div className={`card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20 ${isAnimating ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`text-4xl ${isAnimating ? 'animate-bounce' : ''}`}>
              {emoji}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              <p className="text-navy-400 text-sm">{message}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold text-primary-400 ${isAnimating ? 'scale-125 transition-transform' : 'transition-transform'}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-navy-400 text-sm">
              {streakData.currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Progress bar to 30-day milestone */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to 30-day goal</span>
            <span>{Math.round(streakPercentage)}%</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${streakPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-800">
          <div className="text-center">
            <div className="text-xl font-semibold text-white">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-400">Current</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-yellow-400">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-green-400">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
        </div>

        {/* Streak visualization - last 7 days */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <div className="text-xs text-navy-400 mb-2">Last 7 days</div>
          <div className="flex justify-between gap-1">
            {[...Array(7)].map((_, i) => {
              const dayIndex = 6 - i
              const isActive = dayIndex < streakData.currentStreak
              const isToday = dayIndex === 0
              return (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-500/30 text-primary-400 border border-primary-500/50'
                      : 'bg-navy-800/50 text-navy-600 border border-navy-700/50'
                  } ${isToday ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' : ''}`}
                >
                  {isActive ? '✓' : '·'}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-navy-500">7 days ago</span>
            <span className="text-[10px] text-navy-500">Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}