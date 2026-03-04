'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  lessonsCompleted: number
  totalMinutesLearned: number
}

const STORAGE_KEY = 'learnhub-streak-data'

function getDefaultStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    lessonsCompleted: 0,
    totalMinutesLearned: 0,
  }
}

function loadStreakData(): StreakData {
  if (typeof window === 'undefined') return getDefaultStreakData()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultStreakData()
    
    const data = JSON.parse(stored) as StreakData
    
    // Check if streak should be reset (missed a day)
    if (data.lastLearningDate) {
      const lastDate = new Date(data.lastLearningDate)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays > 1) {
        // Streak broken, but keep stats
        return {
          ...data,
          currentStreak: 0,
        }
      }
    }
    
    return data
  } catch {
    return getDefaultStreakData()
  }
}

export default function LearningStreak() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>(getDefaultStreakData())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = loadStreakData()
    setStreakData(data)
    setIsLoaded(true)
  }, [])

  // Check if user has learned today
  const hasLearnedToday = (): boolean => {
    if (!streakData.lastLearningDate) return false
    const lastDate = new Date(streakData.lastLearningDate).toDateString()
    const today = new Date().toDateString()
    return lastDate === today
  }

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'
  const todayStatus = hasLearnedToday()

  if (!isLoaded) return null

  return (
    <>
      {/* Floating Streak Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="View learning streak"
      >
        <span className="text-xl">{streakEmoji}</span>
        <span className="font-bold">{streakData.currentStreak}</span>
        <span className="text-sm opacity-90">day streak</span>
      </button>

      {/* Expanded Stats Panel */}
      {isExpanded && (
        <div className="fixed bottom-40 right-5 z-40 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-b border-navy-700 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {streakEmoji} Learning Streak
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Current Streak */}
            <div className="text-center py-4 bg-navy-800/50 rounded-xl">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 mt-1">
                {streakData.currentStreak === 1 ? 'day' : 'days'} in a row
              </div>
            </div>

            {/* Today's Status */}
            <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
              todayStatus 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              <span>{todayStatus ? '✅' : '📚'}</span>
              <span className="text-sm font-medium">
                {todayStatus 
                  ? "You've learned today!" 
                  : "Start a lesson to continue your streak!"}
              </span>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center text-sm text-navy-300 italic pt-2">
              {streakData.currentStreak === 0 && "Start your learning journey today! 🚀"}
              {streakData.currentStreak >= 1 && streakData.currentStreak < 3 && "Great start! Keep going! 💪"}
              {streakData.currentStreak >= 3 && streakData.currentStreak < 7 && "You're on fire! Don't stop now! 🔥"}
              {streakData.currentStreak >= 7 && streakData.currentStreak < 14 && "A week of learning! You're amazing! 🌟"}
              {streakData.currentStreak >= 14 && streakData.currentStreak < 30 && "Incredible dedication! Keep it up! 🏆"}
              {streakData.currentStreak >= 30 && "Legend! A month of consistent learning! 👑"}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export utility function to record learning activity
export function recordLearningActivity(lessonDurationMinutes: number = 0): void {
  if (typeof window === 'undefined') return
  
  try {
    const currentData = loadStreakData()
    const today = new Date().toDateString()
    const lastDate = currentData.lastLearningDate 
      ? new Date(currentData.lastLearningDate).toDateString() 
      : null

    let newStreak = currentData.currentStreak

    if (lastDate !== today) {
      // First learning activity of the day
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastDate === yesterday.toDateString()) {
        // Continuing streak from yesterday
        newStreak = currentData.currentStreak + 1
      } else if (lastDate === null || lastDate !== today) {
        // Starting new streak
        newStreak = 1
      }
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentData.longestStreak),
      lastLearningDate: new Date().toISOString(),
      lessonsCompleted: currentData.lessonsCompleted + 1,
      totalMinutesLearned: currentData.totalMinutesLearned + lessonDurationMinutes,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent('streak-updated', { detail: newData }))
  } catch (error) {
    console.error('Failed to record learning activity:', error)
  }
}