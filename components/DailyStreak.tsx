'use client'

import { useState, useEffect } from 'react'

export default function DailyStreak() {
  const [streak, setStreak] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)

  useEffect(() => {
    const streakData = localStorage.getItem('learning-streak')
    if (streakData) {
      try {
        const parsed = JSON.parse(streakData)
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // Only show streak if it's still active
        if (parsed.lastDate === today || parsed.lastDate === yesterdayStr) {
          setStreak(parsed.streak || 0)
        }
      } catch {
        // Invalid data
      }
    }
  }, [])

  if (streak === 0) return null

  const getStreakMessage = () => {
    if (streak >= 30) return "You're on fire! A whole month of learning! 🏆"
    if (streak >= 14) return "Two weeks strong! Keep it going! 💪"
    if (streak >= 7) return "One week streak! You're building great habits! 🌟"
    if (streak >= 3) return "Nice momentum! Keep learning! ⚡"
    return "Great start! Come back tomorrow! 🌱"
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowMotivation(true)}
      onMouseLeave={() => setShowMotivation(false)}
    >
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 cursor-pointer transition-all hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10">
        <span className="text-2xl animate-pulse">🔥</span>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-orange-400">{streak}</span>
          <span className="text-xs text-navy-400 -mt-1">day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Motivation tooltip */}
      {showMotivation && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap">
            <p className="text-sm text-navy-200">{getStreakMessage()}</p>
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-800 border-l border-t border-navy-700 rotate-45" />
        </div>
      )}
    </div>
  )
}