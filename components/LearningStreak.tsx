'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  lessonsCompletedToday: number
  dailyGoal: number
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  lessonsCompletedToday: 0,
  dailyGoal: 1
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData)
  const [isFlaming, setIsFlaming] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Same day visit
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak from yesterday
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          lessonsCompletedToday: 0
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setIsFlaming(true)
        setTimeout(() => setIsFlaming(false), 2000)
      } else {
        // Streak broken
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          lessonsCompletedToday: 0
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        ...defaultStreakData,
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
  }, [])

  const progressPercentage = Math.min(
    (streakData.lessonsCompletedToday / streakData.dailyGoal) * 100,
    100
  )

  const goalMet = streakData.lessonsCompletedToday >= streakData.dailyGoal

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
        goalMet 
          ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30' 
          : 'bg-navy-800/50 border border-navy-700'
      } ${isFlaming ? 'animate-pulse scale-110' : ''}`}>
        <span className={`text-xl transition-transform duration-300 ${isFlaming ? 'animate-bounce' : ''}`}>
          {streakData.currentStreak > 0 ? '🔥' : '❄️'}
        </span>
        <span className={`font-bold ${goalMet ? 'text-orange-400' : 'text-white'}`}>
          {streakData.currentStreak}
        </span>
        
        {/* Mini progress ring */}
        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-navy-700"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progressPercentage * 0.5} 50`}
            className={goalMet ? 'text-orange-400' : 'text-primary-400'}
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50">
          <div className="text-center mb-3">
            <div className="text-3xl mb-1">
              {streakData.currentStreak >= 7 ? '🔥🔥🔥' : streakData.currentStreak >= 3 ? '🔥🔥' : '🔥'}
            </div>
            <div className="text-lg font-bold text-white">
              {streakData.currentStreak} Day Streak!
            </div>
            <div className="text-xs text-navy-400">
              Best: {streakData.longestStreak} days
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Today's Progress</span>
              <span className="text-white">
                {streakData.lessonsCompletedToday}/{streakData.dailyGoal} lessons
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  goalMet 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                    : 'bg-primary-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {goalMet ? (
            <div className="mt-3 text-center text-sm text-yellow-400">
              ✨ Daily goal achieved! ✨
            </div>
          ) : (
            <div className="mt-3 text-center text-sm text-navy-400">
              Complete {streakData.dailyGoal - streakData.lessonsCompletedToday} more lesson{streakData.dailyGoal - streakData.lessonsCompletedToday !== 1 ? 's' : ''} to hit your goal!
            </div>
          )}
        </div>
      )}
    </div>
  )
}