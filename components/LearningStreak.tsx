'use client'

import { useState, useEffect } from 'react'

const motivationalMessages = [
  "🔥 You're on fire! Keep learning!",
  "⭐ Every expert was once a beginner",
  "🚀 Small steps lead to big achievements",
  "💪 Consistency is the key to mastery",
  "🎯 Focus on progress, not perfection",
  "🌟 Your future self will thank you",
  "📈 Learning compounds over time",
  "🏆 Champions are made in practice",
]

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [message, setMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get stored streak data
    const storedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const { count, lastVisit } = JSON.parse(storedData)
      const lastVisitDate = new Date(lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Same day, keep streak
        setStreak(count)
      } else if (lastVisitDate === yesterday) {
        // Consecutive day, increment streak
        const newStreak = count + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub_streak', JSON.stringify({ count: newStreak, lastVisit: today }))
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learnhub_streak', JSON.stringify({ count: 1, lastVisit: today }))
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub_streak', JSON.stringify({ count: 1, lastVisit: today }))
    }

    // Set random motivational message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)] || motivationalMessages[0])
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakColor = () => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-orange-400 to-red-500'
    if (streak >= 7) return 'from-primary-400 to-primary-600'
    return 'from-blue-400 to-primary-500'
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-navy-800/50 to-navy-900/50 border border-navy-700/50 rounded-2xl p-6">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Streak Badge */}
          <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStreakColor()} flex items-center justify-center shadow-lg`}>
              <span className="text-3xl">{getStreakEmoji()}</span>
            </div>
            {streak > 1 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-navy-900 shadow-md">
                {streak}
              </div>
            )}
          </div>
          
          {/* Streak Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{streak} Day</span>
              <span className="text-lg text-navy-400">{streak === 1 ? 'Streak' : 'Streak'}</span>
            </div>
            <p className="text-navy-400 text-sm mt-1">{message}</p>
          </div>
        </div>

        {/* Streak Progress */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-8 rounded-full transition-all ${
                  i < Math.min(streak, 7)
                    ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                    : 'bg-navy-700'
                }`}
                style={{
                  height: `${20 + (i < Math.min(streak, 7) ? i * 4 : 0)}px`
                }}
              />
            ))}
          </div>
          <p className="text-xs text-navy-500 text-center mt-2">Weekly Goal</p>
        </div>
      </div>

      {/* Milestone notification */}
      {(streak === 7 || streak === 14 || streak === 30) && (
        <div className="mt-4 pt-4 border-t border-navy-700/50">
          <div className="flex items-center gap-2 text-primary-400">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-medium">
              {streak === 7 && "One week streak! You're building great habits!"}
              {streak === 14 && "Two week streak! You're unstoppable!"}
              {streak === 30 && "30 day streak! You're a learning champion!"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}