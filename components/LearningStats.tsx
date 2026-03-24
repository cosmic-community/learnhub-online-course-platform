'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
}

interface ProgressData {
  completedLessons: string[]
  streak: number
  lastActiveDate: string
  totalMinutes: number
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]

export default function LearningStats({ totalCourses }: LearningStatsProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('learnhub-progress')
    if (stored) {
      const data = JSON.parse(stored) as ProgressData
      
      // Check if streak should continue or reset
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActive === today) {
        // Already active today
        setProgress(data)
      } else if (lastActive === yesterday.toDateString()) {
        // Streak continues!
        const newStreak = data.streak + 1
        const newData = { ...data, streak: newStreak, lastActiveDate: new Date().toISOString() }
        localStorage.setItem('learnhub-progress', JSON.stringify(newData))
        setProgress(newData)
        
        // Show animation for milestone streaks
        if (STREAK_MILESTONES.includes(newStreak)) {
          setShowStreakAnimation(true)
          setTimeout(() => setShowStreakAnimation(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newData = { ...data, streak: 1, lastActiveDate: new Date().toISOString() }
        localStorage.setItem('learnhub-progress', JSON.stringify(newData))
        setProgress(newData)
      }
    } else {
      // Initialize progress
      const initialData: ProgressData = {
        completedLessons: [],
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        totalMinutes: 0
      }
      localStorage.setItem('learnhub-progress', JSON.stringify(initialData))
      setProgress(initialData)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-navy-700 rounded"></div>
          <div className="h-20 bg-navy-700 rounded"></div>
          <div className="h-20 bg-navy-700 rounded"></div>
        </div>
      </div>
    )
  }

  const completedCount = progress?.completedLessons.length ?? 0
  const streak = progress?.streak ?? 0
  const totalMinutes = progress?.totalMinutes ?? 0

  // Calculate flame intensity based on streak
  const getFlameClasses = () => {
    if (streak >= 30) return 'text-5xl animate-flame-intense'
    if (streak >= 7) return 'text-4xl animate-flame'
    if (streak >= 3) return 'text-3xl animate-flame-soft'
    return 'text-2xl'
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Streak milestone animation overlay */}
      {showStreakAnimation && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-yellow-500/30 to-orange-500/20 animate-pulse z-10 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-bounce">
              <span className="text-6xl">🔥</span>
              <p className="text-xl font-bold text-yellow-400 mt-2">{streak} Day Streak!</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Your Learning Journey
        </h3>
        <div className="flex items-center gap-2">
          <span className={getFlameClasses()}>🔥</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-400">{streak}</span>
            <p className="text-xs text-navy-400">day streak</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-navy-800/50 rounded-xl p-4 text-center group hover:bg-navy-800 transition-all duration-300">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
          <div className="text-2xl font-bold text-white">{completedCount}</div>
          <div className="text-xs text-navy-400">Lessons Done</div>
          <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
              style={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-navy-800/50 rounded-xl p-4 text-center group hover:bg-navy-800 transition-all duration-300">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
          <div className="text-2xl font-bold text-white">{Math.floor(totalMinutes / 60)}h</div>
          <div className="text-xs text-navy-400">Time Spent</div>
          <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{ width: `${Math.min((totalMinutes / 600) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-navy-800/50 rounded-xl p-4 text-center group hover:bg-navy-800 transition-all duration-300">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
          <div className="text-2xl font-bold text-white">{totalCourses}</div>
          <div className="text-xs text-navy-400">Courses Available</div>
          <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
      
      {/* Streak encouragement message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
        <p className="text-sm text-navy-200">
          {streak === 1 && "🌟 You started today! Keep it up tomorrow to build your streak."}
          {streak >= 2 && streak < 7 && `🔥 ${7 - streak} more days to reach a week-long streak!`}
          {streak >= 7 && streak < 30 && `💪 Amazing! You're on fire! ${30 - streak} days until a month-long streak!`}
          {streak >= 30 && "🏆 Legendary learner! You've mastered consistency!"}
        </p>
      </div>
    </div>
  )
}