'use client'

import { useEffect, useState } from 'react'
import { loadProgress, type UserProgress, ACHIEVEMENTS } from '@/lib/progress'

export default function StreakCounter() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  if (!progress || progress.currentStreak === 0) {
    return null
  }

  const streakEmoji = progress.currentStreak >= 30 ? '👑' : 
                      progress.currentStreak >= 7 ? '💪' : '🔥'

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full cursor-default">
        <span className="text-lg animate-pulse">{streakEmoji}</span>
        <span className="text-sm font-semibold text-orange-400">
          {progress.currentStreak} day{progress.currentStreak !== 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-4 bg-navy-800 border border-navy-700 rounded-xl shadow-xl z-50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-800 border-t border-l border-navy-700 rotate-45" />
          
          <div className="relative">
            <h4 className="text-white font-semibold mb-2">🔥 Learning Streak</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-navy-400">Current streak:</span>
                <span className="text-orange-400 font-semibold">{progress.currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Longest streak:</span>
                <span className="text-white font-semibold">{progress.longestStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Lessons completed:</span>
                <span className="text-white font-semibold">{progress.totalLessonsCompleted}</span>
              </div>
            </div>

            {progress.achievements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-navy-700">
                <p className="text-navy-400 text-xs mb-2">Recent achievements:</p>
                <div className="flex flex-wrap gap-1">
                  {progress.achievements.slice(-3).map(achievementId => {
                    const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS]
                    return achievement ? (
                      <span 
                        key={achievementId}
                        className="text-lg"
                        title={achievement.title}
                      >
                        {achievement.icon}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}