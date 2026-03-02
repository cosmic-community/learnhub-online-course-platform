'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  todayCompleted: boolean
  weekProgress: boolean[]
  lastActiveDate: string
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  todayCompleted: false,
  weekProgress: [false, false, false, false, false, false, false],
  lastActiveDate: '',
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>(defaultStreak)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('learning-streak')
    if (saved) {
      const data = JSON.parse(saved) as StreakData
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      // Reset streak if more than a day has passed
      if (lastActive !== today && lastActive !== yesterday) {
        setStreak({
          ...defaultStreak,
          longestStreak: data.longestStreak,
        })
      } else {
        setStreak(data)
      }
    }
  }, [])

  const markTodayComplete = () => {
    if (streak.todayCompleted) return

    setIsAnimating(true)
    const today = new Date()
    const dayOfWeek = today.getDay()
    const newWeekProgress = [...streak.weekProgress]
    newWeekProgress[dayOfWeek] = true

    const newStreak = streak.currentStreak + 1
    const newLongest = Math.max(newStreak, streak.longestStreak)

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      todayCompleted: true,
      weekProgress: newWeekProgress,
      lastActiveDate: today.toISOString(),
    }

    setStreak(newData)
    localStorage.setItem('learning-streak', JSON.stringify(newData))

    // Show celebration for milestones
    if (newStreak === 7 || newStreak === 30 || newStreak % 50 === 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }

    setTimeout(() => setIsAnimating(false), 600)
  }

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-white font-bold text-lg">Amazing Streak!</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Learning Streak</h3>
          <p className="text-navy-400 text-sm">Keep the momentum going!</p>
        </div>
        <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            {streak.currentStreak}
          </div>
          <div className="text-navy-400 text-xs text-center">days</div>
          {streak.currentStreak >= 7 && (
            <div className="absolute -top-1 -right-1 text-lg">🔥</div>
          )}
        </div>
      </div>

      {/* Week progress */}
      <div className="flex justify-between mb-6">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <span className={`text-xs ${index === today ? 'text-primary-400 font-bold' : 'text-navy-500'}`}>
              {day}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                streak.weekProgress[index]
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30'
                  : index === today
                  ? 'bg-navy-700 border-2 border-primary-500/50'
                  : 'bg-navy-800'
              }`}
            >
              {streak.weekProgress[index] && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={markTodayComplete}
        disabled={streak.todayCompleted}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
          streak.todayCompleted
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {streak.todayCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed for Today!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Mark Today Complete
          </span>
        )}
      </button>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-navy-800 flex justify-between text-sm">
        <div className="text-center">
          <div className="text-primary-400 font-semibold">{streak.longestStreak}</div>
          <div className="text-navy-500 text-xs">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-primary-400 font-semibold">
            {streak.weekProgress.filter(Boolean).length}/7
          </div>
          <div className="text-navy-500 text-xs">This Week</div>
        </div>
        <div className="text-center">
          <div className="text-primary-400 font-semibold">
            {streak.currentStreak >= 7 ? '🔥' : streak.currentStreak >= 3 ? '⭐' : '🌱'}
          </div>
          <div className="text-navy-500 text-xs">Status</div>
        </div>
      </div>
    </div>
  )
}