'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearning: number
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Keep that momentum going! 💪",
  "Amazing dedication! 🌟",
  "You're unstoppable! 🚀",
  "Learning champion! 🏆",
  "Consistency is key! 🔑",
  "You're crushing it! 💎",
  "Knowledge seeker! 📚",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just show current data
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowAnimation(true)
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
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
        totalDaysLearning: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowAnimation(true)
    }
    
    // Set random motivational message
    setMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-navy-700 rounded w-1/2 mb-4"></div>
        <div className="h-16 bg-navy-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 animate-pulse" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span> Learning Streak
          </h3>
          {streakData.currentStreak >= 7 && (
            <span className="badge bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
              🏆 Week Warrior
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {/* Main streak display */}
          <div className="flex items-center gap-3">
            <div className={`text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-transparent bg-clip-text ${showAnimation ? 'animate-bounce' : ''}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-navy-400 text-sm">
              day{streakData.currentStreak !== 1 ? 's' : ''}<br />
              <span className="text-orange-400 font-medium">in a row!</span>
            </div>
          </div>
          
          {/* Fire icons based on streak length */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(streakData.currentStreak, 7) }).map((_, i) => (
              <span 
                key={i} 
                className={`text-2xl ${showAnimation ? 'animate-pulse' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                🔥
              </span>
            ))}
            {streakData.currentStreak > 7 && (
              <span className="text-orange-400 text-sm font-bold">+{streakData.currentStreak - 7}</span>
            )}
          </div>
        </div>
        
        {/* Stats row */}
        <div className="mt-4 pt-4 border-t border-navy-700 grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
            <div className="text-navy-500 text-xs">Longest Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{streakData.totalDaysLearning}</div>
            <div className="text-navy-500 text-xs">Total Days</div>
          </div>
        </div>
        
        {/* Motivational message */}
        <div className="mt-4 text-center">
          <p className="text-sm text-navy-300 italic">{message}</p>
        </div>
      </div>
    </div>
  )
}