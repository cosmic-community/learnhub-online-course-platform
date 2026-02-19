'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalMessages = [
  "You're on fire! 🔥",
  "Keep up the momentum! 💪",
  "Learning champion! 🏆",
  "Unstoppable! 🚀",
  "Knowledge seeker! 📚",
  "Amazing dedication! ⭐",
  "You're crushing it! 💥",
  "Learning machine! 🤖",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, no changes
        setStreakData(data)
      } else if (diffDays === 1) {
        // Next day - streak continues!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken - start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const getMessage = () => {
    const index = (streakData.currentStreak - 1) % motivationalMessages.length
    return motivationalMessages[index]
  }

  return (
    <>
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '⭐', '🔥', '✨', '🎯', '💫'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Streak Badge */}
      <div className="fixed bottom-24 left-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            streakData.currentStreak >= 7
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
              : streakData.currentStreak >= 3
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30'
              : 'bg-navy-800 border border-navy-700'
          }`}
        >
          <span className="text-xl animate-pulse">🔥</span>
          <span className="font-bold text-white">{streakData.currentStreak}</span>
          <span className="text-white/80 text-sm hidden sm:inline">day streak</span>
          
          {/* Expanded Panel */}
          {isExpanded && (
            <div className="absolute bottom-full left-0 mb-2 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl min-w-[200px] animate-fadeIn">
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-white">{streakData.currentStreak} Day Streak!</div>
                <div className="text-sm text-primary-400">{getMessage()}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="p-2 bg-navy-800 rounded-lg">
                  <div className="text-white font-semibold">{streakData.longestStreak}</div>
                  <div className="text-navy-400 text-xs">Best Streak</div>
                </div>
                <div className="p-2 bg-navy-800 rounded-lg">
                  <div className="text-white font-semibold">{streakData.totalVisits}</div>
                  <div className="text-navy-400 text-xs">Total Visits</div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-navy-500">
                Come back tomorrow to keep it going!
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}