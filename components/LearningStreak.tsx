'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  longestStreak: number
}

const motivationalMessages = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🔥" },
  { min: 3, max: 6, message: "You're on fire! Amazing dedication!", emoji: "⚡" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "🏆" },
  { min: 14, max: 29, message: "Two weeks of learning! Incredible!", emoji: "💎" },
  { min: 30, max: 59, message: "A month of growth! You're a champion!", emoji: "👑" },
  { min: 60, max: 89, message: "Two months! You're inspiring others!", emoji: "🌟" },
  { min: 90, max: Infinity, message: "Legend status achieved!", emoji: "🦄" },
]

function getMotivationalMessage(streak: number) {
  return motivationalMessages.find(m => streak >= m.min && streak <= m.max) || motivationalMessages[0]
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = getTodayDate()
    const yesterday = getYesterdayDate()

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      
      if (data.lastVisitDate === today) {
        // Already visited today, just show the data
        setStreakData(data)
      } else if (data.lastVisitDate === yesterday) {
        // Visited yesterday, increment streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          longestStreak: data.longestStreak,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  if (!streakData) return null

  const { emoji, message } = getMotivationalMessage(streakData.currentStreak)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 ${
          isAnimating ? 'scale-110 animate-pulse' : ''
        }`}
      >
        <span className={`text-lg ${isAnimating ? 'animate-bounce' : ''}`}>
          {streakData.currentStreak >= 7 ? '🔥' : '✨'}
        </span>
        <span className="text-sm font-semibold text-orange-400">
          {streakData.currentStreak}
        </span>
        <span className="text-xs text-orange-300/70 hidden sm:inline">
          day{streakData.currentStreak !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-navy-800 border border-navy-700 rounded-xl shadow-xl z-50 animate-fadeIn">
          <div className="text-center mb-3">
            <span className="text-3xl">{emoji}</span>
            <h4 className="text-white font-semibold mt-1">Learning Streak</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy-400">Current Streak</span>
              <span className="text-orange-400 font-semibold">{streakData.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Longest Streak</span>
              <span className="text-primary-400 font-semibold">{streakData.longestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Total Days</span>
              <span className="text-white font-semibold">{streakData.totalDaysLearned}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-navy-700">
            <p className="text-xs text-navy-300 text-center italic">{message}</p>
          </div>

          {/* Streak visualization */}
          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  i < Math.min(streakData.currentStreak, 7)
                    ? 'bg-gradient-to-t from-orange-500 to-yellow-400'
                    : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}