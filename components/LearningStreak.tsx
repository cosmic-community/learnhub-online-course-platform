'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  milestoneReached: number | null
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

const STREAK_MESSAGES: Record<number, string> = {
  0: "Welcome! Start your learning journey today 🌱",
  1: "Great start! You're on day 1 🎯",
  2: "Day 2! Keep the momentum going 💪",
  3: "3 days strong! You're building a habit 🔥",
  7: "One week streak! You're unstoppable 🚀",
  14: "Two weeks! Dedication level: Expert 🏆",
  30: "30 days! You're a learning machine 🤖",
  50: "50 days! Legendary commitment 👑",
  100: "100 DAYS! You're an absolute champion! 🎖️",
}

function getStreakMessage(streak: number): string {
  // Find the highest matching milestone message
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return STREAK_MESSAGES[milestone] ?? STREAK_MESSAGES[0] ?? "Keep learning!"
    }
  }
  return STREAK_MESSAGES[0] ?? "Keep learning!"
}

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🎖️'
  if (streak >= 50) return '👑'
  if (streak >= 30) return '🤖'
  if (streak >= 14) return '🏆'
  if (streak >= 7) return '🚀'
  if (streak >= 3) return '🔥'
  if (streak >= 1) return '⭐'
  return '🌱'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      milestoneReached: null
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : null
    
    if (lastVisitDate === today) {
      // Already visited today
      setStreakData(data)
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    let newStreak = data.currentStreak
    let milestoneReached: number | null = null

    if (lastVisitDate === yesterdayString) {
      // Visited yesterday, increment streak
      newStreak = data.currentStreak + 1
    } else if (!lastVisitDate) {
      // First visit ever
      newStreak = 1
    } else {
      // Streak broken, start fresh
      newStreak = 1
    }

    // Check for milestone
    if (MILESTONES.includes(newStreak)) {
      milestoneReached = newStreak
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      lastVisit: today,
      totalVisits: data.totalVisits + 1,
      milestoneReached
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    setStreakData(newData)

    // Trigger animations
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)

    // Show confetti for milestones
    if (milestoneReached) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData || !isVisible) return null

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="relative bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20 border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Streak Counter */}
              <div className={`flex items-center gap-2 transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
                <div className="flex flex-col">
                  <span className="text-xs text-navy-400 uppercase tracking-wider">Learning Streak</span>
                  <span className="text-lg font-bold text-white">
                    {streakData.currentStreak} {streakData.currentStreak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-navy-700" />

              {/* Message */}
              <p className="hidden sm:block text-sm text-navy-300">
                {getStreakMessage(streakData.currentStreak)}
              </p>

              {/* Milestone Badge */}
              {streakData.milestoneReached && (
                <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-sm font-medium animate-pulse">
                  🎉 New Milestone!
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-navy-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss streak banner"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar to Next Milestone */}
        {streakData.currentStreak > 0 && (
          <StreakProgressBar currentStreak={streakData.currentStreak} />
        )}
      </div>
    </>
  )
}

function StreakProgressBar({ currentStreak }: { currentStreak: number }) {
  const nextMilestone = MILESTONES.find(m => m > currentStreak) ?? MILESTONES[MILESTONES.length - 1] ?? 100
  const prevMilestone = [...MILESTONES].reverse().find(m => m <= currentStreak) ?? 0
  
  const progress = nextMilestone > prevMilestone 
    ? ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 100

  return (
    <div className="h-1 bg-navy-800">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )
}