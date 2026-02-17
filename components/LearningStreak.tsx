'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalLessonsCompleted: 0
  })
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    if (savedData) {
      const parsed = JSON.parse(savedData) as StreakData
      setStreakData(parsed)
      
      // Check if streak should be updated
      const today = new Date().toDateString()
      const lastActive = new Date(parsed.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today && lastActive !== yesterday) {
        // Streak broken
        setStreakData(prev => ({ ...prev, currentStreak: 0 }))
      }
    }

    // Set daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'On fire! Keep going!'
    if (streak >= 7) return 'Amazing dedication!'
    if (streak >= 3) return 'Building momentum!'
    if (streak >= 1) return 'Great start!'
    return 'Start your streak today!'
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 animate-pulse" />
      
      <div className="relative z-10">
        {/* Streak Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
            Learning Streak
          </h3>
          <div className={`
            px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 
            border border-orange-500/30 transition-all duration-300
            ${isAnimating ? 'scale-110' : 'scale-100'}
          `}>
            <span className="text-2xl font-bold text-orange-400">
              {streakData.currentStreak}
            </span>
            <span className="text-sm text-orange-300 ml-1">days</span>
          </div>
        </div>

        {/* Streak Message */}
        <p className="text-navy-300 text-sm mb-4">
          {getStreakMessage(streakData.currentStreak)}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-navy-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-primary-400">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400">Longest Streak</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-400">
              {streakData.totalLessonsCompleted}
            </div>
            <div className="text-xs text-navy-400">Lessons Done</div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-navy-800/30 rounded-lg p-4 border-l-4 border-primary-500">
          <p className="text-navy-200 text-sm italic mb-2">
            "{quote.quote}"
          </p>
          <p className="text-navy-400 text-xs">
            — {quote.author}
          </p>
        </div>

        {/* Weekly Progress Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(7)].map((_, i) => {
            const isActive = i < (streakData.currentStreak % 7 || (streakData.currentStreak > 0 ? 7 : 0))
            return (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-400 to-red-400 shadow-lg shadow-orange-500/50' 
                    : 'bg-navy-700'
                  }
                `}
              />
            )
          })}
        </div>
        <p className="text-center text-xs text-navy-500 mt-2">This week's progress</p>
      </div>
    </div>
  )
}