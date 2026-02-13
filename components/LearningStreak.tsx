'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalDays: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      lastVisit: '',
      longestStreak: 0,
      totalDays: 0
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
    const todayDate = new Date(today)
    
    if (data.lastVisit !== today) {
      // Check if this is a consecutive day
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          data.totalDays += 1
          
          // Check for milestone celebrations (every 7 days)
          if (data.currentStreak % 7 === 0 || data.currentStreak === 1) {
            setShowCelebration(true)
            setIsNewMilestone(data.currentStreak > 1)
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
        setShowCelebration(true)
      }
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreak(data)
  }, [])

  // Hide celebration after animation
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streak) return null

  return (
    <>
      {/* Streak Badge */}
      <div className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30">
        <span className="text-lg" role="img" aria-label="fire">🔥</span>
        <span className="text-sm font-semibold text-orange-300">
          {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
        </span>
        
        {/* Tooltip on hover */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 shadow-xl min-w-[200px]">
            <div className="text-xs text-navy-400 mb-2">Learning Streak</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-navy-400">Current</div>
                <div className="text-white font-semibold">{streak.currentStreak} days</div>
              </div>
              <div>
                <div className="text-navy-400">Longest</div>
                <div className="text-white font-semibold">{streak.longestStreak} days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
          
          {/* Celebration message */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce-in">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-xl font-bold">
                {isNewMilestone 
                  ? `${streak.currentStreak} Day Streak!` 
                  : 'Welcome Back!'}
              </div>
              <div className="text-sm opacity-90">
                {isNewMilestone 
                  ? 'Keep up the amazing work!' 
                  : 'Your learning journey begins!'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}