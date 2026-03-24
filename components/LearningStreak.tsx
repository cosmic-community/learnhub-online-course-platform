'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalMinutes: number
  lastActiveDate: string
  weekActivity: boolean[]
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalMinutes: 0,
  lastActiveDate: '',
  weekActivity: [false, false, false, false, false, false, false]
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>(defaultStreak)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastDate = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      // Check if streak should continue or reset
      if (lastDate === today) {
        setStreak(data)
      } else if (lastDate === yesterday) {
        // Continue streak
        const newStreak = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastActiveDate: today,
          weekActivity: [...data.weekActivity.slice(1), true]
        }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        
        // Celebrate milestones
        if (newStreak.currentStreak === 7 || newStreak.currentStreak === 30 || newStreak.currentStreak % 50 === 0) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newStreak = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          totalMinutes: data.totalMinutes,
          lastActiveDate: today,
          weekActivity: [...data.weekActivity.slice(1), true]
        }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      }
    } else {
      // First visit
      const newStreak = {
        currentStreak: 1,
        longestStreak: 1,
        totalMinutes: 0,
        lastActiveDate: today,
        weekActivity: [false, false, false, false, false, false, true]
      }
      setStreak(newStreak)
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
    }

    // Show the component after a delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  // Get streak flame color based on length
  const getFlameColor = () => {
    if (streak.currentStreak >= 30) return 'from-purple-500 to-pink-500'
    if (streak.currentStreak >= 14) return 'from-orange-500 to-red-500'
    if (streak.currentStreak >= 7) return 'from-yellow-500 to-orange-500'
    return 'from-primary-500 to-primary-600'
  }

  if (!isVisible) return null

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Card */}
      <div 
        className={`card p-6 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getFlameColor()} flex items-center justify-center animate-pulse-slow`}>
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Learning Streak</h3>
              <p className="text-navy-400 text-sm">Keep the momentum going!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{streak.currentStreak}</div>
            <div className="text-navy-400 text-xs">day{streak.currentStreak !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Week Activity */}
        <div className="mb-6">
          <div className="flex justify-between gap-2">
            {streak.weekActivity.map((active, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-xs text-navy-500 mb-2">{dayLabels[i]}</div>
                <div 
                  className={`h-8 rounded-lg transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-t from-primary-600 to-primary-400 shadow-lg shadow-primary-500/30' 
                      : 'bg-navy-800'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{streak.longestStreak}</div>
            <div className="text-navy-400 text-xs">Best Streak</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              <span>⭐</span>
              <span>{Math.floor(streak.currentStreak / 7)}</span>
            </div>
            <div className="text-navy-400 text-xs">Weekly Badges</div>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mt-4 text-center">
          {streak.currentStreak === 1 && (
            <p className="text-sm text-navy-300">🎉 Great start! Come back tomorrow to build your streak.</p>
          )}
          {streak.currentStreak >= 2 && streak.currentStreak < 7 && (
            <p className="text-sm text-navy-300">🚀 {7 - streak.currentStreak} more days until your first weekly badge!</p>
          )}
          {streak.currentStreak >= 7 && streak.currentStreak < 30 && (
            <p className="text-sm text-navy-300">⚡ Amazing consistency! Keep it going!</p>
          )}
          {streak.currentStreak >= 30 && (
            <p className="text-sm text-primary-400">🏆 You&apos;re a learning champion!</p>
          )}
        </div>
      </div>
    </>
  )
}