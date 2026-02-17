'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalMinutesToday: number
  dailyGoal: number
}

const STORAGE_KEY = 'learnhub_streak_data'

const motivationalMessages = [
  "You're on fire! 🔥",
  "Keep the momentum going!",
  "Learning champion! 🏆",
  "Unstoppable learner!",
  "Knowledge warrior! ⚔️",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastActive = new Date(data.lastActiveDate).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastActive === today) {
          // Same day, keep streak
          setStreakData(data)
        } else if (lastActive === yesterday) {
          // Consecutive day, increment streak
          const newData: StreakData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastActiveDate: today,
            totalMinutesToday: 0,
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
          setStreakData(newData)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        } else {
          // Streak broken, reset
          const newData: StreakData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastActiveDate: today,
            totalMinutesToday: 0,
            dailyGoal: data.dailyGoal,
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
          setStreakData(newData)
        }
      } else {
        // First time user
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalMinutesToday: 0,
          dailyGoal: 30,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        setStreakData(newData)
      }
    }

    loadStreakData()
    
    // Animate on mount
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded"></div>
      </div>
    )
  }

  const progressPercent = Math.min((streakData.totalMinutesToday / streakData.dailyGoal) * 100, 100)
  const message = motivationalMessages[streakData.currentStreak % motivationalMessages.length]

  return (
    <div className="relative card p-6 overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '1.5rem',
              }}
            >
              {['🎉', '⭐', '🔥', '💪', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span 
              className={`text-2xl transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}
              style={{ 
                filter: streakData.currentStreak >= 7 ? 'drop-shadow(0 0 8px #f59e0b)' : 'none',
                animation: streakData.currentStreak >= 3 ? 'pulse 1s infinite' : 'none'
              }}
            >
              🔥
            </span>
            Learning Streak
          </h3>
          <p className="text-sm text-primary-400 mt-1">{message}</p>
        </div>
        <div className="text-right">
          <div 
            className={`text-4xl font-bold text-white transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-navy-400">
            {streakData.currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy-400">Today's Progress</span>
          <span className="text-white">{streakData.totalMinutesToday}/{streakData.dailyGoal} min</span>
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between pt-4 border-t border-navy-800">
        <div className="text-center">
          <div className="text-xl font-semibold text-white">🏆 {streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-white">⚡ {Math.round(progressPercent)}%</div>
          <div className="text-xs text-navy-400">Daily Goal</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-white">
            {streakData.currentStreak >= 7 ? '🌟' : streakData.currentStreak >= 3 ? '⭐' : '✨'}
          </div>
          <div className="text-xs text-navy-400">
            {streakData.currentStreak >= 7 ? 'Legend' : streakData.currentStreak >= 3 ? 'Rising' : 'Starter'}
          </div>
        </div>
      </div>
    </div>
  )
}