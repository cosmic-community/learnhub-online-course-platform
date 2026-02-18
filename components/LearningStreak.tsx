'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  totalDaysLearned: number
}

const STREAK_KEY = 'learnhub_streak'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysLearned: 0 }
  }
  
  const stored = localStorage.getItem(STREAK_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysLearned: 0 }
}

function updateStreak(): StreakData {
  const today = new Date().toDateString()
  const data = getStreakData()
  
  if (data.lastActiveDate === today) {
    return data // Already logged today
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  let newStreak = data.currentStreak
  
  if (data.lastActiveDate === yesterday.toDateString()) {
    newStreak = data.currentStreak + 1
  } else if (data.lastActiveDate !== today) {
    newStreak = 1 // Reset streak if more than 1 day gap
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastActiveDate: today,
    totalDaysLearned: data.totalDaysLearned + 1
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  
  useEffect(() => {
    const data = updateStreak()
    setStreak(data)
    
    // Check for milestone
    const milestones = [7, 14, 30, 50, 100]
    if (milestones.includes(data.currentStreak)) {
      setShowMilestone(true)
      setTimeout(() => setShowMilestone(false), 3000)
    }
    
    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }, [])
  
  if (!streak) return null
  
  const getStreakEmoji = (days: number) => {
    if (days >= 100) return '🏆'
    if (days >= 50) return '💎'
    if (days >= 30) return '🔥'
    if (days >= 14) return '⚡'
    if (days >= 7) return '🌟'
    if (days >= 3) return '✨'
    return '🎯'
  }
  
  const getStreakMessage = (days: number) => {
    if (days >= 100) return 'Legendary Learner!'
    if (days >= 50) return 'Master Scholar!'
    if (days >= 30) return 'Learning Machine!'
    if (days >= 14) return 'Knowledge Seeker!'
    if (days >= 7) return 'Week Warrior!'
    if (days >= 3) return 'Getting Started!'
    if (days >= 1) return 'Great Start!'
    return 'Start Learning!'
  }
  
  return (
    <>
      {/* Milestone Celebration */}
      {showMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
            <div className="text-center">
              <span className="text-5xl block mb-2">🎉</span>
              <p className="text-2xl font-bold">{streak.currentStreak} Day Streak!</p>
              <p className="text-primary-200">Amazing dedication!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Streak Widget */}
      <div className={`card p-6 relative overflow-hidden group ${isAnimating ? 'animate-pulse' : ''}`}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
                {getStreakEmoji(streak.currentStreak)}
              </span>
              Learning Streak
            </h3>
            <span className="text-xs text-navy-400 bg-navy-800 px-2 py-1 rounded-full">
              {getStreakMessage(streak.currentStreak)}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold text-primary-400 ${isAnimating ? 'scale-110' : ''} transition-transform`}>
                {streak.currentStreak}
              </div>
              <div className="text-xs text-navy-400">Current</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {streak.longestStreak}
              </div>
              <div className="text-xs text-navy-400">Best</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {streak.totalDaysLearned}
              </div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>
          
          {/* Streak Visualization */}
          <div className="mt-4 flex gap-1 justify-center">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-sm transition-all duration-300 ${
                  i < Math.min(streak.currentStreak, 7)
                    ? 'bg-primary-500 shadow-lg shadow-primary-500/50'
                    : 'bg-navy-700'
                }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
          <p className="text-center text-xs text-navy-500 mt-2">
            {streak.currentStreak > 7 ? `+${streak.currentStreak - 7} more days!` : 'Complete a 7-day streak!'}
          </p>
        </div>
      </div>
    </>
  )
}