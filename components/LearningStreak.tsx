'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  milestone: number
}

const milestones = [3, 7, 14, 30, 60, 100, 365]
const motivationalMessages = [
  { min: 0, message: "Start your learning journey today! 🚀" },
  { min: 1, message: "Great start! Keep the momentum going! 💪" },
  { min: 3, message: "3 days strong! You're building a habit! 🌱" },
  { min: 7, message: "A week of learning! You're on fire! 🔥" },
  { min: 14, message: "Two weeks! You're truly committed! ⭐" },
  { min: 30, message: "A month! You're a learning machine! 🏆" },
  { min: 60, message: "Two months! Incredible dedication! 💎" },
  { min: 100, message: "100 days! You're legendary! 👑" },
  { min: 365, message: "A full year! You're unstoppable! 🎉" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadAndUpdateStreak = () => {
      const stored = localStorage.getItem('learningStreak')
      const today = new Date().toDateString()
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalDays: 0,
        milestone: 0
      }

      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
      const todayDate = new Date(today)

      if (data.lastVisit !== today) {
        // Check if last visit was yesterday
        if (lastVisitDate) {
          const diffTime = todayDate.getTime() - lastVisitDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            // Consecutive day - increment streak
            data.currentStreak += 1
            data.totalDays += 1
            
            // Check for new milestone
            const newMilestone = milestones.find(m => m === data.currentStreak)
            if (newMilestone) {
              data.milestone = newMilestone
              setShowCelebration(true)
              setTimeout(() => setShowCelebration(false), 3000)
            }
          } else if (diffDays > 1) {
            // Streak broken - reset
            data.currentStreak = 1
            data.totalDays += 1
          }
        } else {
          // First visit ever
          data.currentStreak = 1
          data.totalDays = 1
        }

        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }

        data.lastVisit = today
        localStorage.setItem('learningStreak', JSON.stringify(data))
      }

      setStreakData(data)
    }

    loadAndUpdateStreak()
  }, [])

  const getMessage = (streak: number) => {
    const applicable = motivationalMessages.filter(m => m.min <= streak)
    return applicable[applicable.length - 1]?.message || motivationalMessages[0].message
  }

  const getNextMilestone = (current: number) => {
    return milestones.find(m => m > current) || milestones[milestones.length - 1]
  }

  const getProgress = (current: number) => {
    const next = getNextMilestone(current)
    const prev = milestones.filter(m => m < next).pop() || 0
    return ((current - prev) / (next - prev)) * 100
  }

  if (!streakData) return null

  return (
    <>
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="bg-primary-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl">
              {streakData.currentStreak} Day Milestone! 
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Compact View */}
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full hover:border-orange-500/50 transition-all">
          <div className="relative">
            <span className="text-2xl">🔥</span>
            {streakData.currentStreak > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {streakData.currentStreak > 99 ? '99+' : streakData.currentStreak}
              </span>
            )}
          </div>
          <span className="text-white font-medium">
            {streakData.currentStreak} day streak
          </span>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-3 w-72 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl p-5 z-50 animate-fadeIn">
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="absolute top-3 right-3 text-navy-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2 animate-pulse">🔥</div>
              <div className="text-3xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-navy-400 text-sm">day learning streak</div>
            </div>

            {/* Motivational Message */}
            <p className="text-center text-primary-400 text-sm mb-4 font-medium">
              {getMessage(streakData.currentStreak)}
            </p>

            {/* Progress to next milestone */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>{streakData.currentStreak} days</span>
                <span>{getNextMilestone(streakData.currentStreak)} day goal</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getProgress(streakData.currentStreak), 100)}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Longest Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{streakData.totalDays}</div>
                <div className="text-navy-400 text-xs">Total Days</div>
              </div>
            </div>

            {/* Milestone Badges */}
            <div className="mt-4 flex justify-center gap-2">
              {milestones.slice(0, 5).map((milestone) => (
                <div
                  key={milestone}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    streakData.currentStreak >= milestone
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-navy-800 text-navy-500'
                  }`}
                >
                  {milestone}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}