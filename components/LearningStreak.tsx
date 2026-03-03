'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: "Great start! Every journey begins with a single step 🚀",
  2: "Day 2! You're building momentum 💪",
  3: "Three days strong! Consistency is key 🔑",
  5: "Five day streak! You're on fire! 🔥",
  7: "One week! You're a learning machine! 🤖",
  14: "Two weeks! Habits are forming! 🧠",
  21: "21 days! They say it takes 21 days to form a habit! 🎯",
  30: "One month! You're unstoppable! 🏆",
  50: "50 days! Legendary dedication! 👑",
  100: "100 DAYS! You're a true champion! 🏅✨",
}

const MILESTONE_DAYS = [3, 5, 7, 14, 21, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showWidget, setShowWidget] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [message, setMessage] = useState('')

  const getMotivationalMessage = useCallback((streak: number): string => {
    // Find the highest applicable message
    const applicableKeys = Object.keys(MOTIVATIONAL_MESSAGES)
      .map(Number)
      .filter(key => key <= streak)
      .sort((a, b) => b - a)
    
    if (applicableKeys.length > 0) {
      return MOTIVATIONAL_MESSAGES[applicableKeys[0]] || ''
    }
    return "Keep learning! 📚"
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just show the widget
        setStreakData(data)
        setShowWidget(true)
        setMessage(getMotivationalMessage(data.currentStreak))
        return
      } else if (lastVisitDate === yesterday) {
        // Consecutive day! Increment streak
        const newStreak = data.currentStreak + 1
        const wasAtMilestone = MILESTONE_DAYS.includes(data.currentStreak)
        const isAtMilestone = MILESTONE_DAYS.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        
        // Check for milestone celebration
        if (isAtMilestone && !wasAtMilestone) {
          setIsNewMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 4000)
        }
      } else {
        // Streak broken, start over
        data = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
      }
    } else {
      // First time visitor
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      setIsNewMilestone(true)
    }
    
    localStorage.setItem('learning-streak', JSON.stringify(data))
    setStreakData(data)
    setMessage(getMotivationalMessage(data.currentStreak))
    
    // Show widget with animation delay
    setTimeout(() => setShowWidget(true), 500)
  }, [getMotivationalMessage])

  const handleDismiss = () => {
    setShowWidget(false)
  }

  if (!streakData || !showWidget) return null

  const fireCount = Math.min(Math.floor(streakData.currentStreak / 3) + 1, 5)

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'][Math.floor(Math.random() * 7)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 left-5 z-50 transition-all duration-500 transform ${
          showWidget ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-4 shadow-2xl shadow-primary-500/10 max-w-[280px]">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 text-navy-300 hover:text-white rounded-full flex items-center justify-center text-sm transition-colors"
            aria-label="Dismiss streak widget"
          >
            ×
          </button>

          {/* Header with Fire Animation */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex animate-pulse">
                {[...Array(fireCount)].map((_, i) => (
                  <span 
                    key={i} 
                    className="text-xl"
                    style={{ 
                      animationDelay: `${i * 0.1}s`,
                      transform: `rotate(${(i - Math.floor(fireCount/2)) * 15}deg)`,
                    }}
                  >
                    🔥
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-navy-300">Learning Streak</span>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="text-center mb-3">
            <div className={`text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent ${isNewMilestone ? 'animate-bounce' : ''}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-navy-400 text-sm">
              {streakData.currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-navy-800/50 rounded-lg p-3 mb-3">
            <p className="text-sm text-navy-200 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-navy-800/30 rounded-lg p-2">
              <div className="text-lg font-semibold text-primary-400">
                {streakData.longestStreak}
              </div>
              <div className="text-xs text-navy-500">Best Streak</div>
            </div>
            <div className="bg-navy-800/30 rounded-lg p-2">
              <div className="text-lg font-semibold text-primary-400">
                {streakData.totalVisits}
              </div>
              <div className="text-xs text-navy-500">Total Visits</div>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          {(() => {
            const nextMilestone = MILESTONE_DAYS.find(m => m > streakData.currentStreak)
            if (!nextMilestone) return null
            
            const prevMilestone = MILESTONE_DAYS.filter(m => m <= streakData.currentStreak).pop() || 0
            const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
            
            return (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-navy-500 mb-1">
                  <span>Next milestone</span>
                  <span>{nextMilestone} days 🎯</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </>
  )
}