'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
}

export default function StreakBanner() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setStreak({
        currentStreak: stats.currentStreak || 0,
        longestStreak: stats.longestStreak || 0,
        lastVisit: stats.lastVisit || '',
      })
    }

    // Check if banner was dismissed today
    const dismissedDate = localStorage.getItem('streak-banner-dismissed')
    if (dismissedDate === new Date().toDateString()) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('streak-banner-dismissed', new Date().toDateString())
  }

  if (!streak || !isVisible || streak.currentStreak < 2) return null

  const getMessage = () => {
    if (streak.currentStreak >= 30) return "🏆 Incredible! A month of learning!"
    if (streak.currentStreak >= 14) return "🌟 Two weeks strong! Keep going!"
    if (streak.currentStreak >= 7) return "⚡ A whole week! You're on fire!"
    if (streak.currentStreak >= 3) return "🔥 Great momentum! Keep it up!"
    return "✨ Nice streak! Don't break it!"
  }

  const isNewRecord = streak.currentStreak >= streak.longestStreak && streak.currentStreak > 1

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-primary-500/10 border-b border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xl">🔥</span>
              <span className="font-bold text-primary-400">{streak.currentStreak}</span>
              <span className="text-navy-300 text-sm">day streak</span>
            </div>
            <span className="text-navy-400">•</span>
            <span className="text-navy-300 text-sm">{getMessage()}</span>
            {isNewRecord && (
              <>
                <span className="text-navy-400">•</span>
                <span className="text-yellow-400 text-sm font-medium animate-pulse">
                  🎉 New Record!
                </span>
              </>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-navy-400 hover:text-navy-200 transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}