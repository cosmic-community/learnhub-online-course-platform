'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learning-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisit === yesterday) {
        // Streak continues!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
        if (newStreak.currentStreak % 7 === 0 || newStreak.currentStreak === 1) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1
        }
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
      }
    } else {
      // First time visitor
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearned: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowCelebration(true)
      setIsNewDay(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streak) return null

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">
            {streak.currentStreak === 1 ? '🎉' : '🔥'}
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: '24px'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="text-2xl animate-pulse">🔥</span>
          <span className="text-xl font-bold text-orange-400">{streak.currentStreak}</span>
        </div>
        <div className="text-sm text-orange-300/80">
          {streak.currentStreak === 1 ? 'day streak' : 'day streak'}
          {isNewDay && streak.currentStreak > 1 && (
            <span className="ml-1 text-green-400">+1!</span>
          )}
        </div>
        {streak.currentStreak >= 7 && (
          <span className="text-lg" title="Week warrior!">🏆</span>
        )}
        {streak.currentStreak >= 30 && (
          <span className="text-lg" title="Monthly master!">👑</span>
        )}
      </div>
    </>
  )
}