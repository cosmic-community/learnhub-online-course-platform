'use client'

import { useState, useEffect } from 'react'

const STREAK_KEY = 'learnhub_streak'
const LAST_VISIT_KEY = 'learnhub_last_visit'

interface StreakData {
  count: number
  lastVisit: string
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem(STREAK_KEY)
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
    
    let currentStreak = stored ? parseInt(stored, 10) : 0
    
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak!
        currentStreak += 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else if (lastVisit !== today) {
        // Streak broken or first visit
        currentStreak = 1
      }
      
      localStorage.setItem(STREAK_KEY, currentStreak.toString())
      localStorage.setItem(LAST_VISIT_KEY, today)
    }
    
    setStreak(currentStreak)
  }, [])

  if (!mounted) return null

  const milestones = [7, 14, 30, 60, 100]
  const nextMilestone = milestones.find(m => m > streak) || streak + 10
  const progress = Math.min((streak / nextMilestone) * 100, 100)

  return (
    <section className="py-8 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5 border-y border-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className={`text-5xl ${streak > 0 ? 'animate-fire' : ''}`}>
                {streak > 0 ? '🔥' : '💫'}
              </span>
              {showCelebration && (
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                  🎉
                </div>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{streak}</span>
                <span className="text-navy-400">day{streak !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-sm text-navy-400">
                {streak === 0 
                  ? 'Start your learning streak today!' 
                  : streak === 1 
                  ? 'Great start! Come back tomorrow!' 
                  : `Keep it going! You're on fire!`}
              </p>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-400">Progress to {nextMilestone}-day streak</span>
              <span className="text-primary-400 font-medium">{streak}/{nextMilestone}</span>
            </div>
            <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex items-center gap-2">
            {milestones.slice(0, 4).map((milestone) => (
              <div
                key={milestone}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  streak >= milestone
                    ? 'bg-primary-500 text-white scale-100 shadow-lg shadow-primary-500/30'
                    : 'bg-navy-800 text-navy-500 scale-90'
                }`}
                title={`${milestone}-day streak achievement`}
              >
                {streak >= milestone ? '✓' : milestone}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}