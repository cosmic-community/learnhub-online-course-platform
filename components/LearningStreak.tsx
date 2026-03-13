'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<number | null>(null)

  const triggerCelebration = useCallback((milestone: number) => {
    setNewMilestone(milestone)
    setShowCelebration(true)
    setTimeout(() => {
      setShowCelebration(false)
      setNewMilestone(null)
    }, 3000)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just load the data
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone
        if (MILESTONES.includes(newStreak)) {
          triggerCelebration(newStreak)
        }
      } else {
        // Streak broken, reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [triggerCelebration])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-navy-700 rounded w-1/3"></div>
      </div>
    )
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progress = Math.min((streakData.currentStreak / nextMilestone) * 100, 100)

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-white font-bold">{newMilestone}-Day Streak!</div>
            <div className="text-primary-400 text-sm">Amazing dedication!</div>
          </div>
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i % 6],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Learning Streak
          </h3>
          <p className="text-navy-400 text-sm">Keep the momentum going!</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-400">{streakData.currentStreak}</div>
          <div className="text-navy-400 text-xs">days</div>
        </div>
      </div>
      
      {/* Progress to next milestone */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-navy-400 mb-1">
          <span>Next milestone: {nextMilestone} days</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
          <div className="text-navy-400 text-xs">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
          <div className="text-navy-400 text-xs">Total Visits</div>
        </div>
      </div>
      
      {/* Motivational message */}
      <div className="mt-4 pt-4 border-t border-navy-700">
        <p className="text-sm text-navy-300 italic">
          {streakData.currentStreak >= 7 
            ? "🌟 You're on fire! Keep up the amazing work!"
            : streakData.currentStreak >= 3
            ? "💪 Great consistency! You're building a habit!"
            : "🚀 Every journey starts with a single step!"}
        </p>
      </div>
    </div>
  )
}