'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
]

const milestoneMessages: Record<number, string> = {
  1: "🎯 First step taken! Your learning journey begins!",
  3: "🔥 3-day streak! You're building momentum!",
  7: "⭐ One week strong! You're unstoppable!",
  14: "🏆 Two weeks! You're in the top 10% of learners!",
  30: "👑 30 days! You're a learning legend!",
  50: "🚀 50 days! Knowledge master in the making!",
  100: "💎 100 days! You've achieved greatness!",
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0])
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState('')

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Load and update streak data
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        if (lastVisitDate === yesterday) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          data.totalVisits += 1
          
          // Check for milestone
          if (milestoneMessages[data.currentStreak]) {
            setIsNewMilestone(true)
            setMilestoneMessage(milestoneMessages[data.currentStreak])
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 4000)
          }
        } else {
          // Streak broken - reset
          data.currentStreak = 1
          data.totalVisits += 1
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        data.lastVisit = today
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setIsNewMilestone(true)
      setMilestoneMessage(milestoneMessages[1] || "Welcome to your learning journey!")
    }
    
    setStreakData(data)
  }, [])

  if (!streakData) return null

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
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][i % 7],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse-slow">🔥</div>
            <div>
              <h3 className="text-lg font-bold text-white">Learning Streak</h3>
              <p className="text-sm text-navy-400">Keep the momentum going!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400">
              {streakData.currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Milestone Message */}
        {isNewMilestone && (
          <div className="mb-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg animate-fade-in">
            <p className="text-primary-300 text-sm font-medium text-center">
              {milestoneMessage}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-white">
              {Math.min(Math.round((streakData.currentStreak / 30) * 100), 100)}%
            </div>
            <div className="text-xs text-navy-400">To 30 Days</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-navy-400 mb-2">
            <span>Progress to next milestone</span>
            <span>{getNextMilestone(streakData.currentStreak)} days</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-out"
              style={{ width: `${getProgressPercentage(streakData.currentStreak)}%` }}
            />
          </div>
        </div>

        {/* Daily Quote */}
        <div className="border-t border-navy-700 pt-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-navy-200 text-sm italic leading-relaxed">
                "{dailyQuote.quote}"
              </p>
              <p className="text-navy-500 text-xs mt-1">— {dailyQuote.author}</p>
            </div>
          </div>
        </div>

        {/* Streak Calendar Preview */}
        <div className="mt-4 pt-4 border-t border-navy-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-navy-400">This week</span>
            <span className="text-xs text-primary-400">Keep it up!</span>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => {
              const dayOffset = 6 - i
              const isActive = dayOffset < streakData.currentStreak
              const isToday = dayOffset === 0
              return (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded ${
                    isActive
                      ? 'bg-gradient-to-t from-orange-600 to-orange-400'
                      : 'bg-navy-800'
                  } ${isToday ? 'ring-2 ring-primary-500 ring-offset-1 ring-offset-navy-900' : ''}`}
                  title={isToday ? 'Today' : `${dayOffset} days ago`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-navy-500">Mon</span>
            <span className="text-[10px] text-navy-500">Sun</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100]
  for (const m of milestones) {
    if (current < m) return m
  }
  return current + 10 // After 100, next milestone is every 10 days
}

function getProgressPercentage(current: number): number {
  const milestones = [1, 3, 7, 14, 30, 50, 100]
  let prevMilestone = 0
  for (const m of milestones) {
    if (current < m) {
      const range = m - prevMilestone
      const progress = current - prevMilestone
      return Math.round((progress / range) * 100)
    }
    prevMilestone = m
  }
  return 100
}