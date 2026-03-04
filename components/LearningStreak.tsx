'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalLessonsViewed: number
  lastVisit: string
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalLessonsViewed: 0,
    lastVisit: ''
  })
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data = JSON.parse(stored) as StreakData
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisit === yesterday) {
        // Continuing streak!
        const newData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Celebrate milestone streaks
        if (newData.currentStreak % 7 === 0 || newData.currentStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          totalLessonsViewed: data.totalLessonsViewed,
          lastVisit: today
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever
      const newData = {
        currentStreak: 1,
        longestStreak: 1,
        totalLessonsViewed: 0,
        lastVisit: today
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'On fire! Keep it up!'
    if (streak >= 7) return 'One week strong!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110"
        aria-label="View learning streak"
      >
        <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
        {streakData.currentStreak > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-primary-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {streakData.currentStreak}
          </span>
        )}
      </button>

      {/* Streak Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-40 right-5 z-50 bg-navy-900 border border-navy-700 rounded-2xl p-6 w-72 shadow-2xl animate-slideUp">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{getStreakEmoji(streakData.currentStreak)}</div>
              <h3 className="text-xl font-bold text-white">
                {streakData.currentStreak} Day Streak!
              </h3>
              <p className="text-sm text-primary-400">{getStreakMessage(streakData.currentStreak)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalLessonsViewed}</div>
                <div className="text-xs text-navy-400">Lessons</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-xs text-navy-400 text-center">
                Keep visiting daily to grow your streak! 🌟
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}