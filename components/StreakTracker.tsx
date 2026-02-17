'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Your learning journey starts today 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🌱" },
  { min: 3, max: 6, message: "You're building a habit! Amazing dedication!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "⭐" },
  { min: 14, max: 29, message: "Two weeks of learning! You're a champion!", emoji: "🏆" },
  { min: 30, max: 59, message: "A whole month! You're absolutely crushing it!", emoji: "💎" },
  { min: 60, max: 89, message: "Two months of dedication! Legendary status!", emoji: "👑" },
  { min: 90, max: Infinity, message: "90+ days! You're a true learning master!", emoji: "🌟" },
]

const MILESTONES = [3, 7, 14, 30, 60, 90, 100, 150, 200, 365]

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just load data
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const isMilestone = MILESTONES.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        
        if (isMilestone) {
          setIsNewMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        data = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!mounted || !streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const getMessage = () => {
    const found = MOTIVATIONAL_MESSAGES.find(
      m => streakData.currentStreak >= m.min && streakData.currentStreak <= m.max
    )
    return found || MOTIVATIONAL_MESSAGES[0]
  }

  const { message, emoji } = getMessage()
  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak + 1
  const progress = ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          {/* Header with streak flame */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl animate-bounce-slow">🔥</span>
                <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              </div>
              <p className="text-navy-400 text-sm">{message}</p>
            </div>
            <div className="text-4xl">{emoji}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-navy-400">Next milestone: {nextMilestone} days</span>
              <span className="text-primary-400">{nextMilestone - streakData.currentStreak} days to go</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Milestone achievement badge */}
          {isNewMilestone && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="text-sm font-semibold text-yellow-400">Milestone Achieved!</div>
                  <div className="text-xs text-yellow-400/70">{streakData.currentStreak} day streak unlocked!</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}