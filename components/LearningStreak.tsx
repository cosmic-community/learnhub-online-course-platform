'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  lessonsViewed: string[]
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Keep the momentum going! 🚀",
  "Consistency is key! 🔑",
  "You're crushing it! 💪",
  "Learning champion! 🏆",
  "Unstoppable! ⚡",
  "Knowledge seeker! 🧠",
  "Rising star! ⭐",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisit === yesterday) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Celebrate milestones
        if (newStreak % 7 === 0 || newStreak === 3 || newStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
          lessonsViewed: data.lessonsViewed,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
        lessonsViewed: [],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }

    // Random motivational message
    setMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!streakData) return null

  const circumference = 2 * Math.PI * 36
  const progress = Math.min((streakData.currentStreak / 30) * 100, 100)
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#29ABE2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
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
        className={`transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
          <div className="flex items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-navy-700"
                />
                {/* Progress Circle */}
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset,
                    transition: 'stroke-dashoffset 1s ease-out',
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#29ABE2" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-xs text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              </div>
              <p className="text-primary-400 font-medium mb-3">{message}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-navy-400">Best: </span>
                  <span className="text-white font-semibold">{streakData.longestStreak} days</span>
                </div>
                <div>
                  <span className="text-navy-400">Total visits: </span>
                  <span className="text-white font-semibold">{streakData.totalVisits}</span>
                </div>
              </div>
            </div>

            {/* Streak Badge */}
            {streakData.currentStreak >= 7 && (
              <div className="hidden sm:flex flex-col items-center gap-1 px-4 py-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                <span className="text-2xl">
                  {streakData.currentStreak >= 30 ? '🏆' : streakData.currentStreak >= 14 ? '🥇' : '🥈'}
                </span>
                <span className="text-xs font-medium text-yellow-400">
                  {streakData.currentStreak >= 30 ? 'Master' : streakData.currentStreak >= 14 ? 'Pro' : 'Dedicated'}
                </span>
              </div>
            )}
          </div>

          {/* Progress to next milestone */}
          {streakData.currentStreak < 30 && (
            <div className="mt-4 pt-4 border-t border-navy-700">
              <div className="flex justify-between text-xs text-navy-400 mb-2">
                <span>Progress to {streakData.currentStreak < 7 ? '7' : streakData.currentStreak < 14 ? '14' : '30'}-day streak</span>
                <span>{streakData.currentStreak}/{streakData.currentStreak < 7 ? '7' : streakData.currentStreak < 14 ? '14' : '30'}</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(streakData.currentStreak / (streakData.currentStreak < 7 ? 7 : streakData.currentStreak < 14 ? 14 : 30)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}