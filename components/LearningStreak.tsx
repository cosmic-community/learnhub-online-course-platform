'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
  weeklyProgress: boolean[]
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalLessonsCompleted: 0,
  weeklyProgress: [false, false, false, false, false, false, false]
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('learnhub-streak')
    if (saved) {
      const data = JSON.parse(saved) as StreakData
      // Check if streak should be maintained or reset
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today && lastActive !== yesterday) {
        // Streak broken - reset current streak but keep longest
        data.currentStreak = 0
        data.weeklyProgress = [false, false, false, false, false, false, false]
      }
      setStreak(data)
    }
    
    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const recordActivity = () => {
    const today = new Date().toDateString()
    const dayOfWeek = new Date().getDay()
    
    setStreak(prev => {
      const isNewDay = prev.lastActiveDate !== today
      const newStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak
      const newTotal = prev.totalLessonsCompleted + 1
      
      // Update weekly progress
      const newWeeklyProgress = [...prev.weeklyProgress]
      newWeeklyProgress[dayOfWeek] = true
      
      const newData: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
        lastActiveDate: today,
        totalLessonsCompleted: newTotal,
        weeklyProgress: newWeeklyProgress
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      
      // Check for milestones
      if (newStreak > 0 && newStreak % 7 === 0) {
        setShowMilestone(true)
        setTimeout(() => setShowMilestone(false), 3000)
      }
      
      return newData
    })
  }

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const todayIndex = new Date().getDay()

  return (
    <div 
      className={`card p-6 transition-all duration-700 transform ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Milestone Celebration */}
      {showMilestone && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-900/90 rounded-2xl z-10 animate-pulse">
          <div className="text-center">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-xl font-bold text-white">{streak.currentStreak} Day Streak!</p>
            <p className="text-primary-400">Amazing dedication!</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Learning Streak
          </h3>
          <p className="text-navy-400 text-sm">Keep the momentum going!</p>
        </div>
        
        {/* Streak Counter */}
        <div className="relative">
          <div className="w-20 h-20 relative">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-navy-700"
              />
              {/* Progress Circle */}
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="url(#streakGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(streak.currentStreak * 32, 226)} 226`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center Number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{streak.currentStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-6">
        <p className="text-navy-400 text-xs mb-2 uppercase tracking-wider">This Week</p>
        <div className="flex justify-between gap-1">
          {dayNames.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className={`text-xs ${index === todayIndex ? 'text-primary-400 font-semibold' : 'text-navy-500'}`}>
                {day}
              </span>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  streak.weeklyProgress[index] 
                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/30' 
                    : index === todayIndex 
                      ? 'bg-navy-700 border-2 border-dashed border-primary-500/50'
                      : 'bg-navy-800'
                }`}
              >
                {streak.weeklyProgress[index] && (
                  <span className="text-white text-sm">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streak.longestStreak}</div>
          <div className="text-navy-400 text-xs">Longest Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streak.totalLessonsCompleted}</div>
          <div className="text-navy-400 text-xs">Lessons Done</div>
        </div>
      </div>

      {/* Demo Button - In production, this would be triggered by actual lesson completion */}
      <button 
        onClick={recordActivity}
        className="w-full mt-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Record Learning Activity ✨
      </button>
    </div>
  )
}