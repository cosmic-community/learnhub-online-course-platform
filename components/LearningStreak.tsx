'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  requirement: number
  type: 'streak' | 'visits' | 'courses'
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-visit', name: 'First Steps', icon: '👋', description: 'Welcome to LearnHub!', requirement: 1, type: 'visits' },
  { id: 'week-streak', name: 'Week Warrior', icon: '🔥', description: '7 day learning streak', requirement: 7, type: 'streak' },
  { id: 'two-week', name: 'Dedicated Learner', icon: '⚡', description: '14 day learning streak', requirement: 14, type: 'streak' },
  { id: 'month-streak', name: 'Learning Legend', icon: '🏆', description: '30 day learning streak', requirement: 30, type: 'streak' },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Visited 10 times', requirement: 10, type: 'visits' },
  { id: 'committed', name: 'Committed', icon: '💎', description: 'Visited 50 times', requirement: 50, type: 'visits' },
]

const DAILY_TIPS = [
  "💡 Consistency beats intensity. Even 15 minutes of daily learning compounds over time.",
  "🎯 Set a specific learning goal for today. What's one thing you want to master?",
  "🧠 Teaching others what you learn reinforces your own understanding.",
  "⏰ Your brain learns best in focused 25-minute sessions with short breaks.",
  "📝 Take notes by hand - it improves retention compared to typing.",
  "🔄 Review yesterday's lesson before starting today's. Spaced repetition works!",
  "🎉 Celebrate small wins. Each lesson completed is progress!",
  "💪 Stuck on a concept? Take a break and return with fresh eyes.",
  "🌟 The best developers never stop learning. You're on the right path!",
  "🚀 Code along with lessons - active learning beats passive watching.",
]

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalVisits: number
  lastVisit: string
  unlockedAchievements: string[]
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [dailyTip, setDailyTip] = useState('')

  useEffect(() => {
    // Get random daily tip based on date (same tip all day)
    const today = new Date().toDateString()
    const tipIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % DAILY_TIPS.length
    setDailyTip(DAILY_TIPS[tipIndex] ?? DAILY_TIPS[0] ?? '')

    // Load and update streak data
    const stored = localStorage.getItem('learnhub-streak')
    const now = new Date()
    const todayStr = now.toDateString()

    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      totalVisits: 0,
      lastVisit: '',
      unlockedAchievements: [],
    }

    // Check if this is a new day
    if (data.lastVisit !== todayStr) {
      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)

      // Check if last visit was yesterday (streak continues) or earlier (streak resets)
      if (lastVisitDate && lastVisitDate.toDateString() === yesterday.toDateString()) {
        data.currentStreak += 1
      } else if (data.lastVisit === '') {
        data.currentStreak = 1
      } else {
        data.currentStreak = 1 // Reset streak
      }

      data.totalVisits += 1
      data.lastVisit = todayStr
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak)

      // Check for new achievements
      const newUnlocked: string[] = []
      ACHIEVEMENTS.forEach(achievement => {
        if (!data.unlockedAchievements.includes(achievement.id)) {
          const value = achievement.type === 'streak' ? data.currentStreak : data.totalVisits
          if (value >= achievement.requirement) {
            newUnlocked.push(achievement.id)
          }
        }
      })

      if (newUnlocked.length > 0) {
        data.unlockedAchievements = [...data.unlockedAchievements, ...newUnlocked]
        const latestAchievement = ACHIEVEMENTS.find(a => a.id === newUnlocked[newUnlocked.length - 1])
        if (latestAchievement) {
          setNewAchievement(latestAchievement)
          setShowConfetti(true)
          setIsOpen(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }

      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const streakProgress = Math.min((streakData.currentStreak / 30) * 100, 100)
  const circumference = 2 * Math.PI * 40

  return (
    <>
      {/* Floating Streak Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group"
        aria-label="View learning streak"
      >
        <span className="text-2xl">🔥</span>
        {streakData.currentStreak > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {streakData.currentStreak}
          </span>
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false)
              setNewAchievement(null)
            }}
          />

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </div>
          )}

          {/* Modal Content */}
          <div className="relative bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-center">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setNewAchievement(null)
                }}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Streak Ring */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (streakProgress / 100) * circumference}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🔥</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-1">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
              </h2>
              <p className="text-white/80">Learning Streak</p>
            </div>

            {/* New Achievement Alert */}
            {newAchievement && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-y border-yellow-500/30 p-4 text-center">
                <p className="text-yellow-400 text-sm font-medium mb-1">🎉 New Achievement Unlocked!</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{newAchievement.icon}</span>
                  <span className="text-white font-semibold">{newAchievement.name}</span>
                </div>
                <p className="text-navy-300 text-sm">{newAchievement.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-navy-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="p-6 border-b border-navy-700">
              <h3 className="text-sm font-semibold text-navy-300 mb-3">Achievements</h3>
              <div className="grid grid-cols-6 gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = streakData.unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`relative group cursor-pointer transition-transform hover:scale-110 ${
                        isUnlocked ? '' : 'opacity-30 grayscale'
                      }`}
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        isUnlocked ? 'bg-navy-700' : 'bg-navy-800'
                      }`}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {achievement.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Daily Tip */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-navy-300 mb-2">Today's Learning Tip</h3>
              <p className="text-navy-200 text-sm leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}