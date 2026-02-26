'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalMinutesLearned: number
  lessonsCompleted: number
  coursesStarted: string[]
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastLearningDate: null,
  totalMinutesLearned: 0,
  lessonsCompleted: 0,
  coursesStarted: [],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      const data = JSON.parse(stored) as StreakData
      // Check if streak should be maintained or reset
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (data.lastLearningDate === today) {
        setStreakData(data)
      } else if (data.lastLearningDate === yesterday) {
        setStreakData(data)
      } else if (data.lastLearningDate) {
        // Streak broken - reset current streak but keep other stats
        const resetData = { ...data, currentStreak: 0 }
        setStreakData(resetData)
        localStorage.setItem('learnhub-streak', JSON.stringify(resetData))
      }
    }
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '💪'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'On fire!'
    if (streak >= 3) return 'Building momentum!'
    if (streak >= 1) return 'Keep it up!'
    return 'Start your streak today!'
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="relative">
      {showCelebration && <ConfettiEffect onComplete={() => setShowCelebration(false)} />}
      
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
            Learning Streak
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-400">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400">days</div>
          </div>
        </div>
        
        <p className="text-navy-300 text-sm mb-4">{getStreakMessage(streakData.currentStreak)}</p>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700/50">
          <div className="text-center">
            <div className="text-xl font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-white">{streakData.lessonsCompleted}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-white">{Math.round(streakData.totalMinutesLearned / 60)}h</div>
            <div className="text-xs text-navy-400">Learned</div>
          </div>
        </div>

        {/* Streak visualization */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(7)].map((_, i) => {
            const isActive = i < Math.min(streakData.currentStreak, 7)
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500 text-white scale-110'
                    : 'bg-navy-800 text-navy-500'
                }`}
              >
                {isActive ? '🔥' : (i + 1)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Confetti Effect Component
function ConfettiEffect({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
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
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][
                Math.floor(Math.random() * 5)
              ],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Export a function to update streak (call this when user completes a lesson)
export function updateLearningStreak(minutesLearned: number = 0): StreakData {
  const stored = localStorage.getItem('learnhub-streak')
  const data: StreakData = stored ? JSON.parse(stored) : DEFAULT_STREAK_DATA
  
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  let newStreak = data.currentStreak
  
  if (data.lastLearningDate !== today) {
    if (data.lastLearningDate === yesterday || data.lastLearningDate === null) {
      newStreak = data.currentStreak + 1
    } else {
      newStreak = 1
    }
  }
  
  const updatedData: StreakData = {
    ...data,
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastLearningDate: today,
    totalMinutesLearned: data.totalMinutesLearned + minutesLearned,
    lessonsCompleted: data.lessonsCompleted + 1,
  }
  
  localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
  return updatedData
}