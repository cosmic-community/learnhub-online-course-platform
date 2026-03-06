'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      if (stored) {
        const data = JSON.parse(stored) as StreakData
        // Check if streak is still valid (last active today or yesterday)
        const lastActive = new Date(data.lastActiveDate)
        const today = new Date()
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays > 1) {
          // Streak broken, reset current but keep longest
          const resetData: StreakData = {
            ...data,
            currentStreak: 0,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(resetData))
          setStreak(resetData)
        } else {
          setStreak(data)
        }
      } else {
        // Initialize streak data
        const initialData: StreakData = {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: new Date().toISOString(),
          totalLessonsCompleted: 0,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(initialData))
        setStreak(initialData)
      }
    }

    loadStreak()

    // Listen for streak updates from other components
    const handleStreakUpdate = () => loadStreak()
    window.addEventListener('streak-updated', handleStreakUpdate)
    
    return () => window.removeEventListener('streak-updated', handleStreakUpdate)
  }, [])

  if (!streak) return null

  const getFlameIntensity = () => {
    if (streak.currentStreak >= 30) return 'text-red-500 animate-pulse'
    if (streak.currentStreak >= 14) return 'text-orange-500'
    if (streak.currentStreak >= 7) return 'text-yellow-500'
    if (streak.currentStreak >= 3) return 'text-yellow-400'
    return 'text-navy-400'
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 transition-all duration-200 border border-navy-700/50">
        <span className={`text-xl ${getFlameIntensity()} transition-all duration-300`}>
          🔥
        </span>
        <span className="font-bold text-white">{streak.currentStreak}</span>
        <span className="text-navy-400 text-sm hidden sm:inline">day streak</span>
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-navy-800 border border-navy-700 rounded-xl shadow-xl z-50 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-navy-300 text-sm">Current Streak</span>
              <span className="text-white font-bold flex items-center gap-1">
                🔥 {streak.currentStreak} days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-300 text-sm">Longest Streak</span>
              <span className="text-primary-400 font-bold flex items-center gap-1">
                🏆 {streak.longestStreak} days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-300 text-sm">Lessons Completed</span>
              <span className="text-green-400 font-bold flex items-center gap-1">
                ✅ {streak.totalLessonsCompleted}
              </span>
            </div>
            <div className="pt-2 border-t border-navy-700">
              <p className="text-navy-400 text-xs text-center">
                {streak.currentStreak === 0 
                  ? "Start learning to build your streak! 💪" 
                  : streak.currentStreak >= 7 
                    ? "You're on fire! Keep it up! 🚀"
                    : "Great progress! Learn daily to keep your streak! 📚"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}