'use client'

import { useEffect, useState } from 'react'
import { loadProgress, type LearningStreak } from '@/lib/progress'

interface StreakWidgetProps {
  compact?: boolean
}

export default function StreakWidget({ compact = false }: StreakWidgetProps) {
  const [streak, setStreak] = useState<LearningStreak | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const progress = loadProgress()
    setStreak(progress.streak)
  }, [])
  
  if (!mounted || !streak) {
    return null
  }
  
  const isActiveToday = streak.lastLearningDate === new Date().toISOString().split('T')[0]
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className={`text-xl ${isActiveToday ? 'animate-bounce' : ''}`}>
          {streak.currentStreak > 0 ? '🔥' : '❄️'}
        </span>
        <span className="font-semibold text-white">
          {streak.currentStreak}
        </span>
        <span className="text-navy-400">day streak</span>
      </div>
    )
  }
  
  // Generate last 7 days
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const isLearned = streak.lastLearningDate >= dateStr && 
      streak.currentStreak >= (7 - i)
    
    days.push({ dayName, isLearned, isToday: i === 0 })
  }
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className={streak.currentStreak > 0 ? 'animate-pulse' : ''}>🔥</span>
          Learning Streak
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-400">
            {streak.currentStreak}
          </div>
          <div className="text-xs text-navy-400">days</div>
        </div>
      </div>
      
      {/* Week visualization */}
      <div className="flex justify-between mb-4">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                day.isLearned
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : day.isToday
                  ? 'bg-navy-700 text-navy-400 border-2 border-dashed border-navy-600'
                  : 'bg-navy-800 text-navy-500'
              }`}
            >
              {day.isLearned ? '✓' : day.isToday ? '?' : ''}
            </div>
            <span className={`text-xs ${day.isToday ? 'text-primary-400 font-semibold' : 'text-navy-500'}`}>
              {day.dayName}
            </span>
          </div>
        ))}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-800">
        <div>
          <div className="text-lg font-semibold text-white">{streak.longestStreak}</div>
          <div className="text-xs text-navy-400">Longest streak</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{streak.totalDaysLearned}</div>
          <div className="text-xs text-navy-400">Total days learned</div>
        </div>
      </div>
      
      {!isActiveToday && streak.currentStreak > 0 && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
          <span className="text-yellow-400 text-sm">
            ⚠️ Learn today to keep your streak going!
          </span>
        </div>
      )}
    </div>
  )
}