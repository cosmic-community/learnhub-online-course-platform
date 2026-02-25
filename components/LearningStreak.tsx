'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
  weeklyActivity: boolean[]
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalLessonsCompleted: 0,
  weeklyActivity: [false, false, false, false, false, false, false]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('learnhub-streak')
    if (saved) {
      const data = JSON.parse(saved) as StreakData
      setStreakData(data)
      
      // Check if streak should continue or reset
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today && lastActive !== yesterday) {
        // Streak broken - reset current but keep longest
        const resetData: StreakData = {
          ...data,
          currentStreak: 0,
          weeklyActivity: [false, false, false, false, false, false, false]
        }
        setStreakData(resetData)
        localStorage.setItem('learnhub-streak', JSON.stringify(resetData))
      }
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const recordActivity = () => {
    const today = new Date()
    const todayStr = today.toDateString()
    const dayOfWeek = today.getDay()
    
    // Check if already recorded today
    if (streakData.lastActiveDate === todayStr) {
      return // Already recorded today
    }
    
    const newWeeklyActivity = [...streakData.weeklyActivity]
    newWeeklyActivity[dayOfWeek] = true
    
    const newStreak = streakData.currentStreak + 1
    const newLongest = Math.max(streakData.longestStreak, newStreak)
    
    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: todayStr,
      totalLessonsCompleted: streakData.totalLessonsCompleted + 1,
      weeklyActivity: newWeeklyActivity
    }
    
    setStreakData(newData)
    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    
    // Celebrate milestones
    if (newStreak === 7 || newStreak === 30 || newStreak === 100 || newStreak % 50 === 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  return (
    <>
      {/* Confetti Celebration Overlay */}
      {showCelebration && (
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
                  backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      <div
        className={`card p-6 transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className={`text-2xl ${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
              🔥
            </span>
            Learning Streak
          </h3>
          <button
            onClick={recordActivity}
            className="btn-primary text-sm py-2 px-4 hover:scale-105 transition-transform"
          >
            Log Today&apos;s Learning
          </button>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-primary-400 tabular-nums">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-navy-400">Current Streak</div>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-yellow-400 tabular-nums">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-navy-400">Best Streak</div>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-green-400 tabular-nums">
              {streakData.totalLessonsCompleted}
            </div>
            <div className="text-sm text-navy-400">Total Sessions</div>
          </div>
        </div>

        {/* Weekly Activity Calendar */}
        <div className="space-y-2">
          <div className="text-sm text-navy-400 font-medium">This Week</div>
          <div className="flex justify-between gap-2">
            {dayNames.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className={`text-xs ${index === today ? 'text-primary-400 font-bold' : 'text-navy-500'}`}>
                  {day}
                </span>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    streakData.weeklyActivity[index]
                      ? 'bg-green-500/20 border-2 border-green-500 scale-110'
                      : index === today
                      ? 'bg-primary-500/20 border-2 border-primary-500/50 animate-pulse'
                      : 'bg-navy-800/50 border border-navy-700'
                  }`}
                >
                  {streakData.weeklyActivity[index] ? (
                    <span className="text-green-400">✓</span>
                  ) : index === today ? (
                    <span className="text-primary-400 text-xs">Today</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-navy-800/50 rounded-xl border border-primary-500/20">
          <p className="text-navy-200 text-sm">
            {streakData.currentStreak === 0 && "Start your learning journey today! 🚀"}
            {streakData.currentStreak >= 1 && streakData.currentStreak < 7 && `Great start! ${7 - streakData.currentStreak} more days to your first week! 💪`}
            {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && `Amazing! You're building a habit! Keep going! 🌟`}
            {streakData.currentStreak >= 30 && `Incredible dedication! You're a learning machine! 🏆`}
          </p>
        </div>
      </div>
    </>
  )
}