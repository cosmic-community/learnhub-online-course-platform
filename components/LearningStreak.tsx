'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalDaysLearned: number
  lessonsCompleted: number
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalDaysLearned: 0,
  lessonsCompleted: 0,
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      const parsed = JSON.parse(stored) as StreakData
      const today = new Date().toDateString()
      const lastActive = new Date(parsed.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      // Check if streak should continue, reset, or stay
      if (lastActive === today) {
        // Already active today
        setStreakData(parsed)
      } else if (lastActive === yesterday) {
        // Streak continues - increment on first activity today
        setStreakData(parsed)
      } else if (parsed.lastActiveDate) {
        // Streak broken - reset current streak but keep stats
        setStreakData({
          ...parsed,
          currentStreak: 0,
        })
      }
    }
  }, [])

  const incrementStreak = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    const current = stored ? (JSON.parse(stored) as StreakData) : defaultStreakData

    if (current.lastActiveDate === today) {
      // Already counted today
      return current
    }

    const newStreak = current.currentStreak + 1
    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
      lastActiveDate: today,
      totalDaysLearned: current.totalDaysLearned + 1,
      lessonsCompleted: current.lessonsCompleted + 1,
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    setStreakData(newData)
    setIsAnimating(true)

    // Check for milestone
    if ([3, 7, 14, 30, 50, 100].includes(newStreak)) {
      setShowMilestone(true)
      setTimeout(() => setShowMilestone(false), 3000)
    }

    setTimeout(() => setIsAnimating(false), 600)
    return newData
  }

  // Expose increment function globally for other components
  useEffect(() => {
    (window as unknown as { incrementLearningStreak?: () => StreakData }).incrementLearningStreak = incrementStreak
  }, [])

  const getFireEmojis = (streak: number) => {
    if (streak === 0) return '❄️'
    if (streak < 3) return '🔥'
    if (streak < 7) return '🔥🔥'
    if (streak < 14) return '🔥🔥🔥'
    if (streak < 30) return '💥🔥🔥🔥'
    return '⭐🔥🔥🔥🔥'
  }

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start your learning streak today!"
    if (streak === 1) return "Great start! Come back tomorrow!"
    if (streak < 3) return "Building momentum! Keep going!"
    if (streak < 7) return "You're on fire! Almost a week!"
    if (streak < 14) return "Amazing dedication! 🌟"
    if (streak < 30) return "Unstoppable learner! 🚀"
    return "Learning legend! 👑"
  }

  return (
    <div className="relative">
      {/* Milestone celebration overlay */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {streakData.currentStreak} Day Streak!
            </h2>
            <p className="text-xl text-primary-400">You&apos;re crushing it!</p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`card p-6 relative overflow-hidden transition-transform duration-300 ${
          isAnimating ? 'scale-105' : ''
        }`}
      >
        {/* Animated background gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 transition-opacity duration-500 ${
            streakData.currentStreak > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className={`transition-transform duration-300 ${isAnimating ? 'scale-150' : ''}`}>
                {getFireEmojis(streakData.currentStreak)}
              </span>
              Learning Streak
            </h3>
            <span className="text-sm text-navy-400">Daily Goal</span>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <span className={`text-5xl font-bold text-white transition-all duration-300 ${
              isAnimating ? 'text-primary-400 scale-110' : ''
            }`}>
              {streakData.currentStreak}
            </span>
            <span className="text-lg text-navy-400 mb-2">days</span>
          </div>

          <p className="text-sm text-navy-300 mb-4">
            {getMotivationalMessage(streakData.currentStreak)}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{streakData.totalDaysLearned}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{streakData.lessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons</div>
            </div>
          </div>
        </div>

        {/* Decorative flames for high streaks */}
        {streakData.currentStreak >= 7 && (
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 animate-pulse">
            🔥
          </div>
        )}
      </div>
    </div>
  )
}