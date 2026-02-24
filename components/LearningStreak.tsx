'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLessonsViewed: number
  lessonsThisWeek: number
  weeklyGoal: number
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  totalLessonsViewed: 0,
  lessonsThisWeek: 0,
  weeklyGoal: 5,
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      // Check if this is a new day
      if (lastVisitDate !== today) {
        // Check if streak continues (visited yesterday) or breaks
        if (lastVisitDate === yesterday) {
          // Streak continues!
          const newStreak = data.currentStreak + 1
          const newData: StreakData = {
            ...data,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            lastVisit: today,
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          
          // Trigger animation for streak milestones
          if (newStreak % 7 === 0 || newStreak === 1) {
            setShowAnimation(true)
            setTimeout(() => setShowAnimation(false), 3000)
          }
        } else {
          // Streak broken - reset
          const newData: StreakData = {
            ...data,
            currentStreak: 1,
            lastVisit: today,
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        }
      } else {
        // Same day, just load the data
        setStreakData(data)
      }
    } else {
      // First time user
      const newData: StreakData = {
        ...DEFAULT_STREAK_DATA,
        currentStreak: 1,
        lastVisit: today,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 3000)
    }
    
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const weeklyProgress = Math.min((streakData.lessonsThisWeek / streakData.weeklyGoal) * 100, 100)
  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Streak animation overlay */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-red-500/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
            🔥
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Learning Streak</h3>
          <p className="text-sm text-navy-400">Keep the momentum going!</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
            <span className="text-3xl">{streakEmoji}</span>
          </div>
          <p className="text-sm text-navy-400">
            {streakData.currentStreak === 1 ? 'day' : 'days'} in a row
          </p>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy-300">Weekly Goal Progress</span>
          <span className="text-primary-400">{streakData.lessonsThisWeek}/{streakData.weeklyGoal} lessons</span>
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streakData.totalLessonsViewed}</div>
          <div className="text-xs text-navy-400">Total Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Longest Streak</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-navy-800/50 rounded-lg">
        <p className="text-sm text-navy-300 text-center">
          {streakData.currentStreak === 0 && "Start learning today to begin your streak! 🚀"}
          {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! 💪"}
          {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && `${7 - streakData.currentStreak} more days until your first weekly streak! 🎯`}
          {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "Amazing! You're on fire! Keep going! 🔥"}
          {streakData.currentStreak >= 30 && "Incredible dedication! You're a learning legend! 👑"}
        </p>
      </div>
    </div>
  )
}

// Hook to record lesson views
export function useRecordLessonView() {
  const recordView = () => {
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const newData: StreakData = {
        ...data,
        totalLessonsViewed: data.totalLessonsViewed + 1,
        lessonsThisWeek: data.lessonsThisWeek + 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
  }
  
  return recordView
}