'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  longestStreak: number
}

const STREAK_STORAGE_KEY = 'learnhub-streak-data'

const motivationalMessages = [
  { min: 0, max: 0, message: "Start your learning journey today! 🌱", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep it going! 🔥", emoji: "🔥" },
  { min: 3, max: 6, message: "You're building momentum! 💪", emoji: "💪" },
  { min: 7, max: 13, message: "One week strong! Amazing! 🌟", emoji: "🌟" },
  { min: 14, max: 29, message: "Two weeks of dedication! 🏆", emoji: "🏆" },
  { min: 30, max: 59, message: "A month of learning! Incredible! 🎯", emoji: "🎯" },
  { min: 60, max: 89, message: "Two months! You're unstoppable! 🚀", emoji: "🚀" },
  { min: 90, max: Infinity, message: "Legend status achieved! 👑", emoji: "👑" },
]

function getMotivationalMessage(streak: number) {
  return motivationalMessages.find(m => streak >= m.min && streak <= m.max) || motivationalMessages[0]
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365]

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    const today = getTodayDate()
    const yesterday = getYesterdayDate()

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      
      if (data.lastVisitDate === today) {
        // Already visited today, just load the data
        setStreakData(data)
      } else if (data.lastVisitDate === yesterday) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          longestStreak: Math.max(data.longestStreak, newStreak),
        }
        setStreakData(newData)
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
        
        // Check for milestone
        if (milestones.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newData: StreakData = {
          currentStreak: 1,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          longestStreak: data.longestStreak,
        }
        setStreakData(newData)
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
        longestStreak: 1,
      }
      setStreakData(newData)
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
      setIsNewMilestone(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  const createConfetti = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    const confettiCount = 50
    const confetti = []
    const colors = ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa']
    
    for (let i = 0; i < confettiCount; i++) {
      const left = Math.random() * 100
      const delay = Math.random() * 0.5
      const duration = 2 + Math.random() * 2
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 8 + Math.random() * 8
      
      confetti.push(
        <div
          key={i}
          className="absolute animate-confetti pointer-events-none"
          style={{
            left: `${left}%`,
            top: '-20px',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      )
    }
    return confetti
  }, [])

  if (!streakData) return null

  const motivation = getMotivationalMessage(streakData.currentStreak)
  const nextMilestone = milestones.find(m => m > streakData.currentStreak) || milestones[milestones.length - 1]
  const progressToNextMilestone = Math.min(
    ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100,
    100
  )

  return (
    <>
      {/* Confetti Container */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {createConfetti()}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative group flex items-center gap-2 px-4 py-2 
            bg-gradient-to-r from-amber-500 to-orange-500 
            text-white font-bold rounded-full shadow-lg 
            hover:shadow-amber-500/40 hover:scale-105
            transition-all duration-300
            ${isNewMilestone ? 'animate-bounce' : ''}
          `}
        >
          <span className="text-xl">{motivation.emoji}</span>
          <span className="text-lg">{streakData.currentStreak}</span>
          <span className="text-xs opacity-80">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {/* Flame animation for active streaks */}
          {streakData.currentStreak >= 3 && (
            <div className="absolute -top-1 -right-1 text-lg animate-pulse">
              🔥
            </div>
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{streakData.currentStreak}</div>
                  <div className="text-sm opacity-90">Day Streak</div>
                </div>
                <div className="text-5xl">{motivation.emoji}</div>
              </div>
              <p className="mt-2 text-sm opacity-90">{motivation.message}</p>
            </div>

            {/* Progress to next milestone */}
            <div className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Next milestone</span>
                <span className="text-primary-400 font-semibold">{nextMilestone} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextMilestone}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 pt-0">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
                <div className="text-xs text-navy-400">Total Days</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
            </div>

            {/* Motivational tip */}
            <div className="px-4 pb-4">
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-xs text-navy-300">
                    {streakData.currentStreak < 7 
                      ? "Visit daily to build your streak! Even 5 minutes of learning counts."
                      : streakData.currentStreak < 30
                      ? "You're doing amazing! Consistency is the key to mastery."
                      : "You're in the top 1% of learners! Keep inspiring others!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}