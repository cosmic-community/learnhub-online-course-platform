'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MILESTONES = [7, 14, 30, 60, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [animatedStreak, setAnimatedStreak] = useState(0)

  const getNextMilestone = useCallback((streak: number) => {
    return MILESTONES.find(m => m > streak) || MILESTONES[MILESTONES.length - 1]
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = {
      currentStreak: 1,
      lastVisit: today,
      longestStreak: 1,
      totalVisits: 1
    }

    if (stored) {
      const parsed = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(parsed.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day visit
        data = parsed
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak = parsed.currentStreak + 1
        const hitMilestone = MILESTONES.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(parsed.longestStreak, newStreak),
          totalVisits: parsed.totalVisits + 1
        }
        
        if (hitMilestone) {
          setIsNewMilestone(true)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else {
        // Streak broken - reset
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: parsed.longestStreak,
          totalVisits: parsed.totalVisits + 1
        }
      }
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)

    // Animate the streak counter
    const targetStreak = data.currentStreak
    let current = 0
    const increment = Math.ceil(targetStreak / 20)
    const timer = setInterval(() => {
      current += increment
      if (current >= targetStreak) {
        setAnimatedStreak(targetStreak)
        clearInterval(timer)
      } else {
        setAnimatedStreak(current)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  if (!streakData) return null

  const nextMilestone = getNextMilestone(streakData.currentStreak)
  const progress = (streakData.currentStreak / nextMilestone) * 100
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const getStreakEmoji = (streak: number) => {
    if (streak >= 365) return '🏆'
    if (streak >= 100) return '💎'
    if (streak >= 60) return '🌟'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 365) return 'Legendary learner!'
    if (streak >= 100) return 'Unstoppable!'
    if (streak >= 60) return 'On fire!'
    if (streak >= 30) return 'Dedicated!'
    if (streak >= 14) return 'Great momentum!'
    if (streak >= 7) return 'Building habits!'
    if (streak >= 3) return 'Keep it up!'
    return 'Just getting started!'
  }

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
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
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3'][
                    Math.floor(Math.random() * 7)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce-in">
            <div className="text-6xl mb-4">{getStreakEmoji(streakData.currentStreak)}</div>
            <div className="text-2xl font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 rounded-xl shadow-2xl">
              🎉 {streakData.currentStreak} Day Streak! 🎉
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
          aria-label="View learning streak"
        >
          {/* Animated glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-14 h-14 bg-navy-900 rounded-full border-2 border-navy-700 flex items-center justify-center overflow-hidden group-hover:border-primary-500 transition-colors">
            {/* Progress ring */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-navy-700"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="url(#streakGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Streak number */}
            <span className="text-lg font-bold text-white z-10">{animatedStreak}</span>
          </div>

          {/* Notification dot for new milestone */}
          {isNewMilestone && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping" />
          )}
        </button>

        {/* Expanded panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-64 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 bg-gradient-to-r from-primary-500/20 to-orange-500/20 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</span>
                <div>
                  <div className="text-2xl font-bold text-white">{streakData.currentStreak} Days</div>
                  <div className="text-sm text-primary-400">{getStreakMessage(streakData.currentStreak)}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Progress to next milestone */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy-400">Next milestone</span>
                  <span className="text-white font-medium">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Milestone badges */}
              <div>
                <div className="text-xs text-navy-400 mb-2">Milestones</div>
                <div className="flex gap-2 flex-wrap">
                  {MILESTONES.slice(0, 5).map((milestone) => (
                    <div
                      key={milestone}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        streakData.currentStreak >= milestone
                          ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white scale-110'
                          : 'bg-navy-800 text-navy-500'
                      }`}
                    >
                      {milestone}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Close hint */}
            <div className="px-4 py-2 bg-navy-800/50 text-center">
              <span className="text-xs text-navy-500">Click to close</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}