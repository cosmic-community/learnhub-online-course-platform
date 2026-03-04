'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalMessages = [
  { minStreak: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { minStreak: 1, message: "Great start! Keep the momentum going!", emoji: "⭐" },
  { minStreak: 3, message: "You're building a habit! Amazing!", emoji: "🔥" },
  { minStreak: 7, message: "One week strong! You're unstoppable!", emoji: "💪" },
  { minStreak: 14, message: "Two weeks! You're a dedicated learner!", emoji: "🏆" },
  { minStreak: 30, message: "One month! You're truly committed!", emoji: "👑" },
  { minStreak: 60, message: "Legendary dedication! Keep shining!", emoji: "✨" },
  { minStreak: 100, message: "100 days! You're an inspiration!", emoji: "🌟" },
]

function getMotivationalMessage(streak: number): { message: string; emoji: string } {
  const sorted = [...motivationalMessages].sort((a, b) => b.minStreak - a.minStreak)
  const found = sorted.find(m => streak >= m.minStreak)
  return found || motivationalMessages[0]
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return 'from-yellow-400 to-orange-500'
  if (streak >= 14) return 'from-purple-400 to-pink-500'
  if (streak >= 7) return 'from-blue-400 to-cyan-500'
  if (streak >= 3) return 'from-green-400 to-emerald-500'
  return 'from-primary-400 to-primary-600'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, no change
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const { message, emoji } = getMotivationalMessage(streakData.currentStreak)
  const gradientColor = getStreakColor(streakData.currentStreak)
  const progressPercent = Math.min((streakData.currentStreak / 30) * 100, 100)

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
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
              {['🎉', '⭐', '🔥', '✨', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Streak Ring */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-navy-800"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#streakGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${isAnimating ? progressPercent * 2.51 : 0} 251`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`text-primary-400`} stopColor="currentColor" />
                <stop offset="100%" className={`text-primary-600`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl">{emoji}</span>
            <span className={`text-2xl font-bold bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
              {streakData.currentStreak}
            </span>
          </div>
        </div>

        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <h3 className="text-xl font-bold text-white">
              {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak!
            </h3>
          </div>
          <p className="text-navy-300 text-sm mb-3">{message}</p>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400">🏆</span>
              <span className="text-navy-400">Best:</span>
              <span className="text-white font-medium">{streakData.longestStreak} days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400">📚</span>
              <span className="text-navy-400">Visits:</span>
              <span className="text-white font-medium">{streakData.totalVisits}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar to next milestone */}
      <div className="mt-4 pt-4 border-t border-navy-800">
        <div className="flex items-center justify-between text-xs text-navy-400 mb-2">
          <span>Progress to 30-day milestone</span>
          <span>{Math.min(streakData.currentStreak, 30)}/30 days</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-1000 ease-out rounded-full`}
            style={{ width: isAnimating ? `${progressPercent}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}