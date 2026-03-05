'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Start your learning journey today 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🌱" },
  { min: 3, max: 6, message: "You're building a habit! Amazing progress!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week streak! You're unstoppable!", emoji: "⭐" },
  { min: 14, max: 29, message: "Two weeks strong! True dedication!", emoji: "💪" },
  { min: 30, max: 59, message: "A month of learning! You're a champion!", emoji: "🏆" },
  { min: 60, max: 89, message: "Two months! Learning legend status!", emoji: "👑" },
  { min: 90, max: Infinity, message: "90+ days! You're absolutely incredible!", emoji: "🌟" },
]

const MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day visit
        setStreak(data)
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreak(newData)
        
        // Check for milestone celebration
        if (MILESTONES.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreak(newData)
      }
    } else {
      // First time visitor
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreak(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }, [])

  const getMotivationalMessage = (streakCount: number) => {
    const message = MOTIVATIONAL_MESSAGES.find(
      m => streakCount >= m.min && streakCount <= m.max
    )
    return message || MOTIVATIONAL_MESSAGES[0]
  }

  const getNextMilestone = (current: number) => {
    return MILESTONES.find(m => m > current) || null
  }

  const getStreakFlameColor = (streak: number) => {
    if (streak >= 30) return 'text-yellow-400'
    if (streak >= 14) return 'text-orange-400'
    if (streak >= 7) return 'text-orange-500'
    return 'text-primary-400'
  }

  if (!streak) return null

  const motivation = getMotivationalMessage(streak.currentStreak)
  const nextMilestone = getNextMilestone(streak.currentStreak)
  const progress = nextMilestone 
    ? ((streak.currentStreak / nextMilestone) * 100).toFixed(0) 
    : 100

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-7xl mb-4">
              {isNewMilestone ? '🎉' : '✨'}
            </div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-pulse">
              <p className="text-xl font-bold">
                {isNewMilestone 
                  ? `🔥 ${streak.currentStreak} Day Milestone! 🔥` 
                  : 'Welcome to LearnHub!'}
              </p>
            </div>
          </div>
          {/* Confetti-like particles */}
          {isNewMilestone && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                >
                  {['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl shadow-xl transition-all duration-300 hover:border-primary-500/50 hover:shadow-primary-500/10 ${
            isExpanded ? 'rounded-b-none border-b-0' : ''
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`text-3xl ${getStreakFlameColor(streak.currentStreak)} ${streak.currentStreak >= 7 ? 'animate-pulse' : ''}`}>
                🔥
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">
                  {streak.currentStreak}
                </div>
                <div className="text-xs text-navy-400">
                  day{streak.currentStreak !== 1 ? 's' : ''} streak
                </div>
              </div>
            </div>
            <div className="text-2xl">
              {motivation.emoji}
            </div>
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="bg-navy-900/95 backdrop-blur-md border border-navy-700 border-t-0 rounded-b-2xl p-4 animate-fadeIn">
            {/* Motivational Message */}
            <p className="text-sm text-navy-200 mb-4 text-center italic">
              "{motivation.message}"
            </p>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-navy-400 mb-1">
                  <span>Progress to {nextMilestone} days</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{streak.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{streak.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div className="mt-4 pt-4 border-t border-navy-800">
              <p className="text-xs text-navy-400 mb-2">Upcoming Milestones</p>
              <div className="flex flex-wrap gap-2">
                {MILESTONES.filter(m => m > streak.currentStreak).slice(0, 4).map(milestone => (
                  <span 
                    key={milestone}
                    className={`text-xs px-2 py-1 rounded-full ${
                      milestone === nextMilestone 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'bg-navy-800 text-navy-400'
                    }`}
                  >
                    {milestone} days
                  </span>
                ))}
              </div>
            </div>

            {/* Close hint */}
            <p className="text-center text-xs text-navy-500 mt-3">
              Click to minimize
            </p>
          </div>
        )}
      </div>
    </>
  )
}