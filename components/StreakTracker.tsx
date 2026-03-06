'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalDays: number
}

const motivationalMessages: Record<number, string> = {
  1: "🌱 Great start! Every expert was once a beginner.",
  2: "🔥 Two days in! You're building momentum.",
  3: "⚡ Three days strong! Consistency is key.",
  5: "🌟 Five days! You're on fire!",
  7: "🏆 One week streak! You're unstoppable!",
  14: "💪 Two weeks! You're a learning machine!",
  21: "🎯 Three weeks! Habits are forming!",
  30: "🚀 One month! You're a true learner!",
  50: "👑 50 days! You're a legend!",
  100: "🏅 100 days! Absolutely incredible!",
}

const learningTips = [
  "💡 Tip: Take breaks every 25 minutes to boost retention!",
  "💡 Tip: Teaching others is the best way to learn!",
  "💡 Tip: Practice coding daily, even just 15 minutes!",
  "💡 Tip: Review yesterday's lesson before starting new content!",
  "💡 Tip: Build projects to apply what you learn!",
  "💡 Tip: Join coding communities to stay motivated!",
  "💡 Tip: Sleep helps consolidate learning - rest well!",
  "💡 Tip: Write notes by hand for better memory!",
  "💡 Tip: Explain concepts out loud to yourself!",
  "💡 Tip: Embrace errors - they're learning opportunities!",
]

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#6366f1',
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dailyTip, setDailyTip] = useState('')
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const getMessage = useCallback((streak: number): string => {
    const milestones = Object.keys(motivationalMessages)
      .map(Number)
      .sort((a, b) => b - a)
    
    for (const milestone of milestones) {
      if (streak >= milestone) {
        return motivationalMessages[milestone] ?? "Keep learning!"
      }
    }
    return "🎓 Welcome! Start your learning journey today!"
  }, [])

  useEffect(() => {
    // Get daily tip based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(learningTips[dayOfYear % learningTips.length] ?? learningTips[0] ?? '')

    // Load and update streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today_str = today.toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit)
      const daysDiff = Math.floor((today.getTime() - lastVisitDate.getTime()) / 86400000)
      
      if (data.lastVisit !== today_str) {
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          const newStreak = data.currentStreak + 1
          const milestones = [5, 7, 14, 21, 30, 50, 100]
          
          if (milestones.includes(newStreak)) {
            setShowConfetti(true)
            setIsNewMilestone(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
          
          data = {
            currentStreak: newStreak,
            lastVisit: today_str,
            longestStreak: Math.max(data.longestStreak, newStreak),
            totalDays: data.totalDays + 1,
          }
        } else if (daysDiff > 1) {
          // Streak broken
          data = {
            currentStreak: 1,
            lastVisit: today_str,
            longestStreak: data.longestStreak,
            totalDays: data.totalDays + 1,
          }
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        lastVisit: today_str,
        longestStreak: 1,
        totalDays: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
    
    setStreakData(data)
  }, [])

  if (!streakData) return null

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="fixed bottom-24 right-5 z-40">
        {/* Collapsed view - just the flame */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110"
            aria-label="View learning streak"
          >
            <span className="text-2xl">🔥</span>
            <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
              {streakData.currentStreak}
            </span>
            {isNewMilestone && (
              <span className="absolute -top-2 -left-2 animate-ping bg-yellow-400 rounded-full w-4 h-4" />
            )}
          </button>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-2xl w-72 animate-fadeIn">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 text-navy-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Streak display */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-2 animate-bounce">🔥</div>
              <div className="text-3xl font-bold text-white mb-1">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-navy-400">Learning Streak</div>
            </div>

            {/* Motivational message */}
            <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-center text-white">
                {getMessage(streakData.currentStreak)}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-navy-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-primary-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">{streakData.totalDays}</div>
                <div className="text-xs text-navy-400">Total Days</div>
              </div>
            </div>

            {/* Daily tip */}
            <div className="bg-navy-800/50 rounded-lg p-3">
              <p className="text-xs text-navy-300">{dailyTip}</p>
            </div>

            {/* Progress to next milestone */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Next milestone</span>
                <span>{getNextMilestone(streakData.currentStreak)} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [5, 7, 14, 21, 30, 50, 100]
  for (const m of milestones) {
    if (current < m) return m
  }
  return current + 10
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 5, 7, 14, 21, 30, 50, 100]
  let prevMilestone = 0
  let nextMilestone = 5
  
  for (let i = 0; i < milestones.length - 1; i++) {
    const m = milestones[i] ?? 0
    const next = milestones[i + 1] ?? 100
    if (current >= m && current < next) {
      prevMilestone = m
      nextMilestone = next
      break
    }
  }
  
  if (current >= 100) return 100
  
  const range = nextMilestone - prevMilestone
  const progress = current - prevMilestone
  return Math.min(100, (progress / range) * 100)
}