'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
  totalVisits: number
}

const motivationalQuotes = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "⭐" },
  { min: 3, max: 6, message: "You're building a habit! Amazing!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "💪" },
  { min: 14, max: 29, message: "Two weeks! True dedication!", emoji: "🏆" },
  { min: 30, max: 59, message: "A month of learning! Incredible!", emoji: "🎯" },
  { min: 60, max: 89, message: "60+ days! You're a legend!", emoji: "👑" },
  { min: 90, max: Infinity, message: "90+ days! Mastery in progress!", emoji: "🌟" },
]

function getMotivationalMessage(streak: number) {
  return motivationalQuotes.find(q => streak >= q.min && streak <= q.max) || motivationalQuotes[0]
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateString === yesterday.toISOString().split('T')[0]
}

function isToday(dateString: string): boolean {
  return dateString === getTodayDateString()
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const initializeStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = getTodayDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      
      if (isToday(data.lastVisitDate)) {
        // Already visited today
        setStreakData(data)
      } else if (isYesterday(data.lastVisitDate)) {
        // Continuing streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisitDate: today,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
        
        // Celebrate milestones
        if ([3, 7, 14, 30, 60, 90, 100].includes(newData.currentStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisitDate: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisitDate: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsNewStreak(true)
    }
  }, [])

  useEffect(() => {
    initializeStreak()
  }, [initializeStreak])

  useEffect(() => {
    if (isNewStreak && streakData) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isNewStreak, streakData])

  if (!streakData) {
    return null
  }

  const { message, emoji } = getMotivationalMessage(streakData.currentStreak)
  const streakIntensity = Math.min(streakData.currentStreak, 30) / 30 // Max intensity at 30 days

  return (
    <div className="relative">
      {/* Celebration confetti overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div 
        className={`
          relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-navy-800/80 to-navy-900/80
          border border-navy-700/50
          backdrop-blur-sm
          transition-all duration-500
          ${isAnimating ? 'scale-105 shadow-2xl shadow-primary-500/30' : ''}
        `}
      >
        {/* Animated glow effect based on streak */}
        <div 
          className="absolute inset-0 opacity-20 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, rgba(20, 184, 166, ${streakIntensity * 0.5}) 0%, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-4">
          {/* Streak flame icon with animation */}
          <div className={`
            relative text-4xl
            ${streakData.currentStreak > 0 ? 'animate-flame' : ''}
          `}>
            <span className="relative z-10">
              {streakData.currentStreak === 0 ? '❄️' : streakData.currentStreak >= 7 ? '🔥' : '🌟'}
            </span>
            {streakData.currentStreak >= 7 && (
              <span className="absolute inset-0 animate-ping opacity-30">🔥</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className={`
                text-3xl font-bold text-white
                ${isAnimating ? 'animate-bounce-in' : ''}
              `}>
                {streakData.currentStreak}
              </span>
              <span className="text-navy-400 text-sm">
                {streakData.currentStreak === 1 ? 'day' : 'days'} streak
              </span>
            </div>

            <p className="text-sm text-primary-400 mt-1 flex items-center gap-1">
              <span>{emoji}</span>
              <span>{message}</span>
            </p>
          </div>

          {/* Stats badge */}
          <div className="text-right">
            <div className="text-xs text-navy-500">Best</div>
            <div className="text-lg font-semibold text-navy-300">
              {streakData.longestStreak}
              <span className="text-xs text-navy-500 ml-1">days</span>
            </div>
          </div>
        </div>

        {/* Progress bar to next milestone */}
        {streakData.currentStreak > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-500 mb-1">
              <span>Progress to next milestone</span>
              <span>{getNextMilestone(streakData.currentStreak)} days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 60, 90, 100, 150, 200, 365]
  return milestones.find(m => m > current) || current + 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 30, 60, 90, 100, 150, 200, 365]
  const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0
  const nextMilestone = milestones.find(m => m > current) || current + 30
  
  const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  return Math.min(Math.max(progress, 0), 100)
}