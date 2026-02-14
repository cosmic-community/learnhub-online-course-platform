'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
}

const STREAK_STORAGE_KEY = 'learnhub-streak-data'

const milestones = [7, 14, 30, 60, 100, 365]

const motivationalMessages: Record<number, string> = {
  0: "Start your learning journey today! 🚀",
  1: "Great start! Keep it going! 💪",
  3: "You're building momentum! 🔥",
  7: "One week strong! You're unstoppable! 🏆",
  14: "Two weeks! You're forming a habit! ⭐",
  30: "A whole month! You're a learning machine! 🎯",
  60: "60 days! Incredible dedication! 💎",
  100: "100 DAYS! You're a legend! 👑",
  365: "ONE YEAR! You've mastered consistency! 🌟",
}

function getMotivationalMessage(streak: number): string {
  const sortedKeys = Object.keys(motivationalMessages)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const key of sortedKeys) {
    if (streak >= key) {
      return motivationalMessages[key] ?? motivationalMessages[0] ?? "Keep learning!"
    }
  }
  return motivationalMessages[0] ?? "Start your learning journey today! 🚀"
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isYesterday(dateString: string): boolean {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalDaysLearned: 0,
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMilestone, setCelebrationMilestone] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    const today = new Date().toISOString().split('T')[0]
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      
      if (isToday(data.lastVisitDate)) {
        // Already visited today, just load the data
        setStreakData(data)
        return
      }
      
      if (isYesterday(data.lastVisitDate)) {
        // Consecutive day! Increase streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone celebration
        if (milestones.includes(newStreak)) {
          setCelebrationMilestone(newStreak)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 5000)
        }
        
        // Trigger animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)
      } else {
        // Streak broken, reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
      }
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!mounted) {
    return (
      <div className="card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-navy-700 rounded w-32 mb-4"></div>
          <div className="h-4 bg-navy-700 rounded w-48"></div>
        </div>
      </div>
    )
  }

  const nextMilestone = milestones.find(m => m > streakData.currentStreak) ?? 365
  const progressToNextMilestone = ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in" />
          <div className="relative z-10 text-center animate-bounce-in">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {celebrationMilestone} Day Streak!
            </h2>
            <p className="text-xl text-primary-400">
              You're absolutely crushing it!
            </p>
            {/* Confetti particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Streak Card */}
      <div className={`card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20 relative overflow-hidden ${isAnimating ? 'animate-streak-pop' : ''}`}>
        {/* Animated fire background */}
        <div className="absolute top-0 right-0 opacity-20 text-8xl animate-fire-flicker">
          🔥
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-4xl ${streakData.currentStreak > 0 ? 'animate-fire-glow' : ''}`}>
                  {streakData.currentStreak > 0 ? '🔥' : '💤'}
                </span>
                <span className="text-4xl font-bold text-white">
                  {streakData.currentStreak}
                </span>
                <span className="text-lg text-navy-400">
                  day{streakData.currentStreak !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-primary-400 font-medium">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-navy-400">Best Streak</div>
              <div className="text-xl font-bold text-white flex items-center gap-1 justify-end">
                <span>👑</span>
                <span>{streakData.longestStreak}</span>
              </div>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-navy-400 mb-2">
              <span>Progress to {nextMilestone}-day milestone</span>
              <span>{streakData.currentStreak}/{nextMilestone}</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNextMilestone, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-navy-700/50 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
              <div className="text-sm text-navy-400">Total Days Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak >= 7 ? '🌟' : streakData.currentStreak >= 3 ? '⭐' : '☆'}
              </div>
              <div className="text-sm text-navy-400">
                {streakData.currentStreak >= 7 ? 'On Fire!' : streakData.currentStreak >= 3 ? 'Getting Hot' : 'Warming Up'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}