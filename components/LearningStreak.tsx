'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: string[]
}

const motivationalMessages = [
  "🔥 You're on fire! Keep the momentum going!",
  "⭐ Every day of learning is a step toward mastery!",
  "🚀 Your dedication is inspiring! Keep pushing forward!",
  "💪 Consistency beats intensity. You've got this!",
  "🎯 Small progress is still progress. Great job showing up!",
  "🌟 Champions are made through daily habits!",
  "📚 Knowledge compounds. Every session matters!",
  "🏆 You're building something amazing, one day at a time!",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [message, setMessage] = useState('')
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    // Load and update streak data
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub_streak')
    let data: StreakData

    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      if (lastVisitDate === today) {
        // Already visited today, just load data
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const isNewRecord = newStreak > data.longestStreak
        
        data = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        
        // Check for milestones
        if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak % 50 === 0) {
          setShowConfetti(true)
          setIsNewMilestone(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        
        localStorage.setItem('learnhub_streak', JSON.stringify(data))
        setStreakData(data)
      } else {
        // Streak broken, reset
        data = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(data))
        setStreakData(data)
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        coursesViewed: [],
      }
      localStorage.setItem('learnhub_streak', JSON.stringify(data))
      setStreakData(data)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }

    // Set random motivational message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  if (!streakData) {
    return null
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🏆'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '🔥'
    return '✨'
  }

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-purple-400 to-pink-500'
    if (streak >= 7) return 'from-orange-400 to-red-500'
    if (streak >= 3) return 'from-primary-400 to-primary-600'
    return 'from-navy-400 to-navy-600'
  }

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${getStreakColor(streakData.currentStreak)} animate-pulse`} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl animate-bounce">{getStreakEmoji(streakData.currentStreak)}</span>
              Learning Streak
            </h3>
            {isNewMilestone && (
              <span className="badge bg-yellow-500/20 text-yellow-400 animate-pulse">
                🎉 Milestone!
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Current Streak */}
            <div className="text-center">
              <div className={`text-4xl font-bold bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} bg-clip-text text-transparent`}>
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 text-xs mt-1">Day Streak</div>
            </div>

            {/* Longest Streak */}
            <div className="text-center border-x border-navy-700">
              <div className="text-4xl font-bold text-white">
                {streakData.longestStreak}
              </div>
              <div className="text-navy-400 text-xs mt-1">Best Streak</div>
            </div>

            {/* Total Visits */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {streakData.totalVisits}
              </div>
              <div className="text-navy-400 text-xs mt-1">Total Visits</div>
            </div>
          </div>

          {/* Streak Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Progress to next milestone</span>
              <span>
                {streakData.currentStreak < 3 ? '3 days' : 
                 streakData.currentStreak < 7 ? '7 days' : 
                 streakData.currentStreak < 14 ? '14 days' : 
                 streakData.currentStreak < 30 ? '30 days' : '50 days'}
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} transition-all duration-1000 ease-out`}
                style={{
                  width: `${Math.min(100, (streakData.currentStreak / (
                    streakData.currentStreak < 3 ? 3 :
                    streakData.currentStreak < 7 ? 7 :
                    streakData.currentStreak < 14 ? 14 :
                    streakData.currentStreak < 30 ? 30 : 50
                  )) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Motivational Message */}
          <p className="text-sm text-navy-300 italic text-center">
            {message}
          </p>

          {/* Streak Badges */}
          <div className="flex justify-center gap-2 mt-4">
            <span className={`text-lg ${streakData.currentStreak >= 3 ? 'opacity-100' : 'opacity-30'}`} title="3 Day Streak">🔥</span>
            <span className={`text-lg ${streakData.currentStreak >= 7 ? 'opacity-100' : 'opacity-30'}`} title="7 Day Streak">⚡</span>
            <span className={`text-lg ${streakData.currentStreak >= 14 ? 'opacity-100' : 'opacity-30'}`} title="14 Day Streak">🏆</span>
            <span className={`text-lg ${streakData.currentStreak >= 30 ? 'opacity-100' : 'opacity-30'}`} title="30 Day Streak">👑</span>
          </div>
        </div>
      </div>
    </div>
  )
}