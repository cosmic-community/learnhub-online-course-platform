'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  count: number
  lastVisit: string
  milestone: number
}

const MILESTONES = [3, 7, 14, 30, 60, 100]
const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Start your learning journey today 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "⭐" },
  { min: 3, max: 6, message: "You're on fire! 3 days and counting!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week streak! You're unstoppable!", emoji: "💪" },
  { min: 14, max: 29, message: "Two weeks strong! Incredible dedication!", emoji: "🏆" },
  { min: 30, max: 59, message: "A whole month! You're a learning machine!", emoji: "🎯" },
  { min: 60, max: 99, message: "60 days! You're inspiring others!", emoji: "🌟" },
  { min: 100, max: Infinity, message: "100+ days! You're a legend!", emoji: "👑" },
]

function getMotivationalMessage(streak: number) {
  return MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max) || MOTIVATIONAL_MESSAGES[0]
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateString === yesterday.toISOString().split('T')[0]
}

function isToday(dateString: string): boolean {
  return dateString === getTodayString()
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastVisit: '', milestone: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get stored streak data
    const stored = localStorage.getItem('learnhub-streak')
    let currentStreak: StreakData = stored 
      ? JSON.parse(stored) 
      : { count: 0, lastVisit: '', milestone: 0 }

    const today = getTodayString()

    // Check if already visited today
    if (isToday(currentStreak.lastVisit)) {
      setStreak(currentStreak)
      return
    }

    // Check if visited yesterday (streak continues)
    if (isYesterday(currentStreak.lastVisit)) {
      currentStreak.count += 1
    } else if (currentStreak.lastVisit !== '') {
      // Streak broken - reset
      currentStreak.count = 1
    } else {
      // First visit ever
      currentStreak.count = 1
    }

    currentStreak.lastVisit = today

    // Check for milestone
    const hitMilestone = MILESTONES.find(m => m === currentStreak.count && m > currentStreak.milestone)
    if (hitMilestone) {
      currentStreak.milestone = hitMilestone
      setIsNewMilestone(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(currentStreak))
    setStreak(currentStreak)
  }, [])

  const message = getMotivationalMessage(streak.count)

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-center gap-6">
          {/* Streak Counter */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-shadow duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streak.count}</div>
                <div className="text-xs text-orange-100">day{streak.count !== 1 ? 's' : ''}</div>
              </div>
            </div>
            
            {/* Fire Animation for streaks > 0 */}
            {streak.count > 0 && (
              <div className="absolute -top-2 -right-1 text-2xl animate-bounce-slow">
                🔥
              </div>
            )}
            
            {/* Crown for 100+ days */}
            {streak.count >= 100 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">
                👑
              </div>
            )}
          </div>

          {/* Message */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              <span className="text-xl">{message.emoji}</span>
              {isNewMilestone && (
                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full animate-pulse">
                  New Milestone!
                </span>
              )}
            </div>
            <p className="text-navy-300 text-sm">{message.message}</p>
            
            {/* Progress to next milestone */}
            {streak.count > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
                  <span>Next milestone</span>
                  <span>
                    {(() => {
                      const next = MILESTONES.find(m => m > streak.count)
                      return next ? `${next} days` : 'All achieved! 🎉'
                    })()}
                  </span>
                </div>
                <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-primary-500 rounded-full transition-all duration-500"
                    style={{
                      width: (() => {
                        const nextMilestone = MILESTONES.find(m => m > streak.count)
                        if (!nextMilestone) return '100%'
                        const prevMilestone = MILESTONES.filter(m => m <= streak.count).pop() || 0
                        const progress = ((streak.count - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                        return `${Math.min(progress, 100)}%`
                      })()
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Streak Badges */}
          <div className="hidden sm:flex flex-col gap-1.5">
            {MILESTONES.slice(0, 4).map(milestone => (
              <div
                key={milestone}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all duration-300 ${
                  streak.count >= milestone
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-navy-800/50 text-navy-500'
                }`}
              >
                <span>{streak.count >= milestone ? '✓' : '○'}</span>
                <span>{milestone}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}