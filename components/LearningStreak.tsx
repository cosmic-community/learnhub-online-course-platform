'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const milestones = [7, 14, 30, 60, 100, 365]

const motivationalMessages: Record<number, string> = {
  0: "Start your learning journey today! 🚀",
  1: "Great start! Keep it going! 💪",
  2: "Two days strong! 🌟",
  3: "Three's the charm! ✨",
  7: "One week streak! You're on fire! 🔥",
  14: "Two weeks! Incredible dedication! 🏆",
  30: "One month! You're unstoppable! 🎯",
  60: "Two months! Learning legend! 👑",
  100: "100 days! You're a master! 🌟",
  365: "One year! Absolutely legendary! 🏅",
}

function getMotivationalMessage(streak: number): string {
  // Find the highest milestone message that applies
  const sortedMilestones = Object.keys(motivationalMessages)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const milestone of sortedMilestones) {
    if (streak >= milestone) {
      return motivationalMessages[milestone] ?? "Keep learning! 📚"
    }
  }
  return motivationalMessages[0] ?? "Start learning! 📚"
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string; delay: number; size: number }>>([])

  useEffect(() => {
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#f59e0b',
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMilestone, setIsMilestone] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored 
      ? JSON.parse(stored) 
      : { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }

    if (data.lastVisit === today) {
      // Already visited today, just show current data
      setStreakData(data)
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = data.lastVisit === yesterday.toDateString()

    if (wasYesterday) {
      // Continuing streak!
      data.currentStreak += 1
    } else if (data.lastVisit !== '') {
      // Streak broken, reset
      data.currentStreak = 1
    } else {
      // First visit ever
      data.currentStreak = 1
    }

    data.lastVisit = today
    data.totalVisits += 1
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak)

    // Check for milestone celebration
    if (milestones.includes(data.currentStreak)) {
      setIsMilestone(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    // Small delay for a nice entrance effect
    const timer = setTimeout(() => {
      checkAndUpdateStreak()
    }, 500)
    return () => clearTimeout(timer)
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const { currentStreak, longestStreak, totalVisits } = streakData
  const message = getMotivationalMessage(currentStreak)
  const nextMilestone = milestones.find(m => m > currentStreak) ?? 365
  const progressToNext = currentStreak > 0 ? (currentStreak / nextMilestone) * 100 : 0

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:scale-105 ${
            isExpanded ? 'w-full rounded-2xl rounded-b-none px-4 py-3' : 'px-4 py-3'
          } ${isMilestone ? 'animate-pulse' : ''}`}
        >
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg">{currentStreak}</span>
          {!isExpanded && (
            <span className="text-sm opacity-90">day streak</span>
          )}
          {isExpanded && (
            <span className="flex-1 text-left text-sm font-medium">Day Streak!</span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="bg-navy-900 border border-navy-700 rounded-2xl rounded-t-none p-4 shadow-xl animate-slideUp">
            <p className="text-sm text-navy-300 mb-4">{message}</p>
            
            {/* Progress to next milestone */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Progress to {nextMilestone} days</span>
                <span>{currentStreak}/{nextMilestone}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{longestStreak}</div>
                <div className="text-xs text-navy-400">Longest Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>

            {/* Milestone badges */}
            <div className="mt-4 pt-4 border-t border-navy-800">
              <p className="text-xs text-navy-400 mb-2">Milestones</p>
              <div className="flex gap-2 flex-wrap">
                {milestones.slice(0, 5).map((milestone) => (
                  <div
                    key={milestone}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStreak >= milestone
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-110'
                        : 'bg-navy-800 text-navy-500'
                    }`}
                  >
                    {milestone}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}