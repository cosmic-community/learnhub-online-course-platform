'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Your learning journey begins today! 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "✨" },
  { min: 3, max: 6, message: "You're on fire! Consistency is the key to mastery!", emoji: "🔥" },
  { min: 7, max: 13, message: "A full week! You're building a powerful habit!", emoji: "💪" },
  { min: 14, max: 29, message: "Two weeks strong! You're unstoppable!", emoji: "🌟" },
  { min: 30, max: 59, message: "A whole month! You're becoming a legend!", emoji: "🏆" },
  { min: 60, max: 89, message: "60+ days! Masters are made through dedication!", emoji: "👑" },
  { min: 90, max: Infinity, message: "90+ days! You're an absolute BEAST! 🐲", emoji: "🦁" },
]

const DAILY_TIPS = [
  { tip: "Practice coding for at least 30 minutes daily to build muscle memory.", category: "Habit" },
  { tip: "Break complex problems into smaller, manageable pieces.", category: "Problem Solving" },
  { tip: "Reading code is just as important as writing code.", category: "Learning" },
  { tip: "Don't memorize syntax—understand concepts and look up syntax as needed.", category: "Mindset" },
  { tip: "Build projects! Theory without practice fades quickly.", category: "Practice" },
  { tip: "Teach what you learn to others—it solidifies your knowledge.", category: "Growth" },
  { tip: "Take breaks! Your brain consolidates learning during rest.", category: "Wellness" },
  { tip: "Version control early and often. Git is your best friend.", category: "Tools" },
  { tip: "Read error messages carefully—they usually tell you what's wrong.", category: "Debugging" },
  { tip: "Write comments for your future self. You'll thank yourself later.", category: "Best Practice" },
  { tip: "Learn keyboard shortcuts—they compound into hours saved.", category: "Productivity" },
  { tip: "Embrace failure. Every bug fixed is a lesson learned.", category: "Mindset" },
  { tip: "Code review others' work—you'll learn new patterns and approaches.", category: "Growth" },
  { tip: "Keep a learning journal to track your progress and insights.", category: "Habit" },
]

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }
  }
  
  const stored = localStorage.getItem('learnhub_streak')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }
    }
  }
  return { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }
}

function saveStreakData(data: StreakData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('learnhub_streak', JSON.stringify(data))
  }
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastVisit: '',
    longestStreak: 0,
    totalVisits: 0,
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get today's tip based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyTip(DAILY_TIPS[dayOfYear % DAILY_TIPS.length])

    // Update streak
    const todayStr = getDateString(today)
    const existingData = getStreakData()
    
    if (existingData.lastVisit === todayStr) {
      // Already visited today
      setStreakData(existingData)
      return
    }

    let newStreak = 1
    let isNewRecord = false

    if (existingData.lastVisit) {
      const daysDiff = getDaysDifference(existingData.lastVisit, todayStr)
      
      if (daysDiff === 1) {
        // Consecutive day
        newStreak = existingData.currentStreak + 1
      } else if (daysDiff === 0) {
        // Same day
        newStreak = existingData.currentStreak
      }
      // Otherwise streak resets to 1
    }

    const milestones = [3, 7, 14, 30, 60, 90, 100, 365]
    if (milestones.includes(newStreak) && newStreak > existingData.currentStreak) {
      setShowConfetti(true)
      setIsNewMilestone(true)
      setTimeout(() => {
        setShowConfetti(false)
        setIsNewMilestone(false)
      }, 3000)
    }

    if (newStreak > existingData.longestStreak) {
      isNewRecord = true
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      lastVisit: todayStr,
      longestStreak: Math.max(newStreak, existingData.longestStreak),
      totalVisits: existingData.totalVisits + 1,
    }

    saveStreakData(newData)
    setStreakData(newData)
  }, [])

  const motivationalMessage = MOTIVATIONAL_MESSAGES.find(
    m => streakData.currentStreak >= m.min && streakData.currentStreak <= m.max
  ) || MOTIVATIONAL_MESSAGES[0]

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Card */}
        <div className={`card p-6 relative overflow-hidden ${isNewMilestone ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''}`}>
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl animate-bounce">🔥</span>
                Learning Streak
              </h3>
              {streakData.currentStreak === streakData.longestStreak && streakData.currentStreak > 0 && (
                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                  Personal Best! 🏆
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent ${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
                {streakData.currentStreak}
              </span>
              <span className="text-navy-400 text-lg">
                {streakData.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* Flame Visualization */}
            <div className="flex gap-1 mb-4">
              {[...Array(Math.min(streakData.currentStreak, 7))].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-10 relative"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span 
                    className="absolute inset-0 text-2xl animate-flame"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    🔥
                  </span>
                </div>
              ))}
              {streakData.currentStreak > 7 && (
                <span className="text-navy-400 self-center ml-2">+{streakData.currentStreak - 7}</span>
              )}
              {streakData.currentStreak === 0 && (
                <span className="text-navy-500 text-sm">Start your streak today!</span>
              )}
            </div>

            <p className="text-navy-300 flex items-center gap-2">
              <span className="text-xl">{motivationalMessage.emoji}</span>
              <span>{motivationalMessage.message}</span>
            </p>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-navy-800 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-navy-500">Longest Streak</div>
                <div className="text-lg font-semibold text-white">{streakData.longestStreak} days</div>
              </div>
              <div>
                <div className="text-sm text-navy-500">Total Visits</div>
                <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tip Card */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Daily Learning Tip
              </h3>
              <span className="text-xs bg-navy-800 text-navy-400 px-2 py-1 rounded-full">
                {dailyTip.category}
              </span>
            </div>

            <blockquote className="text-xl text-navy-200 leading-relaxed mb-6 font-medium">
              "{dailyTip.tip}"
            </blockquote>

            <div className="flex items-center justify-between">
              <p className="text-sm text-navy-500">
                New tip every day! Come back tomorrow for more wisdom.
              </p>
              <button
                onClick={() => {
                  const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]
                  setDailyTip(randomTip)
                }}
                className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Random Tip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}