'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
  longestStreak: number
}

const motivationalMessages: Record<number, string> = {
  0: "Start your learning journey today! 🚀",
  1: "Great start! You're building momentum! 💪",
  2: "2 days strong! Keep it up! 🔥",
  3: "3 day streak! You're on fire! 🔥🔥",
  5: "5 days! You're unstoppable! ⚡",
  7: "A whole week! Amazing dedication! 🏆",
  14: "2 weeks! You're a learning machine! 🤖",
  30: "30 days! Legendary learner! 👑",
}

function getMotivationalMessage(streak: number): string {
  const thresholds = Object.keys(motivationalMessages)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const threshold of thresholds) {
    if (streak >= threshold) {
      return motivationalMessages[threshold] ?? motivationalMessages[0] ?? "Keep learning!"
    }
  }
  return motivationalMessages[0] ?? "Keep learning!"
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '👑'
  if (streak >= 14) return '🏆'
  if (streak >= 7) return '⭐'
  if (streak >= 3) return '🔥'
  if (streak >= 1) return '✨'
  return '🌱'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday - increment streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 2000)
      } else {
        // Streak broken - start over
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          longestStreak: data.longestStreak,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 2000)
    }
  }, [])

  if (!streakData) return null

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Main Streak Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative flex items-center gap-2 px-4 py-3 
          bg-gradient-to-r from-orange-500 to-amber-500 
          hover:from-orange-600 hover:to-amber-600
          text-white font-semibold rounded-full shadow-lg
          transition-all duration-300 ease-out
          ${showAnimation ? 'scale-110 animate-bounce' : 'hover:scale-105'}
        `}
      >
        <span className="text-xl">{getStreakEmoji(streakData.currentStreak)}</span>
        <span className="text-lg">{streakData.currentStreak}</span>
        <span className="text-sm opacity-90">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
        
        {/* Pulse animation for new streak */}
        {showAnimation && (
          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-40" />
        )}
      </button>

      {/* Expanded Stats Panel */}
      {isExpanded && (
        <div 
          className="absolute bottom-full left-0 mb-3 w-72 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl p-5 animate-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-navy-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl">
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-sm text-navy-400">Keep learning!</div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-navy-800/50 rounded-lg p-3 mb-4 text-center">
            <p className="text-primary-400 font-medium">
              {getMotivationalMessage(streakData.currentStreak)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{streakData.totalDays}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
            <div className="bg-navy-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>This Week</span>
              <span>{Math.min(streakData.currentStreak, 7)}/7 days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((streakData.currentStreak / 7) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Fun fact based on streak */}
          {streakData.currentStreak >= 7 && (
            <div className="mt-4 text-center text-xs text-navy-400">
              🎉 You're in the top 10% of learners!
            </div>
          )}
        </div>
      )}
    </div>
  )
}