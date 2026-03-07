'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    // Get stored streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday - increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: new Date().toISOString(),
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setIsNewDay(true)
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: new Date().toISOString(),
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewDay(true)
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toISOString(),
        totalDays: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setIsNewDay(true)
    }
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const streakEmoji = streakData.currentStreak >= 30 ? '👑' :
                      streakData.currentStreak >= 14 ? '🔥' :
                      streakData.currentStreak >= 7 ? '⚡' :
                      streakData.currentStreak >= 3 ? '🌟' : '✨'

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '🎊', '⭐', '🌟', '💫', '✨', '🎯', '📚'][Math.floor(Math.random() * 8)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-5xl">{streakEmoji}</div>
              {isNewDay && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
              {isNewDay && streakData.currentStreak > 1 && (
                <p className="text-primary-400 text-sm font-medium animate-pulse">
                  🎉 Streak extended! Keep it up!
                </p>
              )}
              {isNewDay && streakData.currentStreak === 1 && (
                <p className="text-primary-400 text-sm font-medium">
                  Welcome back! Your journey continues.
                </p>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="w-px h-10 bg-navy-700" />
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.totalDays}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {streakData.currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Progress to next badge</span>
              <span>{getNextMilestone(streakData.currentStreak).label}</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${getNextMilestone(streakData.currentStreak).progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getNextMilestone(current: number): { label: string; progress: number } {
  if (current < 3) return { label: '🌟 3-day streak', progress: (current / 3) * 100 }
  if (current < 7) return { label: '⚡ 7-day streak', progress: ((current - 3) / 4) * 100 }
  if (current < 14) return { label: '🔥 14-day streak', progress: ((current - 7) / 7) * 100 }
  if (current < 30) return { label: '👑 30-day streak', progress: ((current - 14) / 16) * 100 }
  return { label: '👑 Champion!', progress: 100 }
}