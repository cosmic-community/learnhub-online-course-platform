'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: "Great start! Every journey begins with a single step 🚀",
  2: "Two days in a row! You're building momentum 💪",
  3: "Three-day streak! You're on fire 🔥",
  5: "Five days! You're unstoppable 🌟",
  7: "One week streak! Consistency is key 🏆",
  14: "Two weeks! You're a dedicated learner 📚",
  21: "21 days - a habit is forming! 🧠",
  30: "One month streak! You're incredible 🎉",
  50: "50 days! You're a learning machine 🤖",
  100: "100 DAYS! You're a legend! 👑",
}

const MILESTONE_STREAKS = [3, 5, 7, 14, 21, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const createConfetti = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `
      confettiContainer.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 4000)
    }
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (data.lastVisit === today) {
        // Already visited today, just show the streak
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day! Increase streak
        const previousStreak = data.currentStreak
        data.currentStreak += 1
        data.lastVisit = today
        data.totalVisits += 1
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        
        // Check for new milestone
        if (MILESTONE_STREAKS.includes(data.currentStreak) && !MILESTONE_STREAKS.includes(previousStreak)) {
          setIsNewMilestone(true)
          setShowConfetti(true)
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
      } else {
        // Streak broken, start over
        data = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
    }

    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, createConfetti])

  if (!streakData) return null

  const getMessage = (): string => {
    // Find the highest applicable message
    const sortedKeys = Object.keys(MOTIVATIONAL_MESSAGES)
      .map(Number)
      .sort((a, b) => b - a)
    
    for (const key of sortedKeys) {
      if (streakData.currentStreak >= key) {
        return MOTIVATIONAL_MESSAGES[key]
      }
    }
    return "Welcome back! Keep learning 📖"
  }

  const getStreakEmoji = (): string => {
    if (streakData.currentStreak >= 100) return '👑'
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '⭐'
    if (streakData.currentStreak >= 7) return '🔥'
    if (streakData.currentStreak >= 3) return '✨'
    return '🌱'
  }

  const getProgressToNextMilestone = (): { next: number; progress: number } => {
    const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak) || 100
    const prevMilestone = [...MILESTONE_STREAKS].reverse().find(m => m <= streakData.currentStreak) || 0
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    return { next: nextMilestone, progress: Math.min(progress, 100) }
  }

  const { next, progress } = getProgressToNextMilestone()

  return (
    <>
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        aria-hidden="true"
      />
      
      {/* Streak Banner */}
      <div 
        className={`bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 border-b border-primary-500/20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className={`relative ${isNewMilestone ? 'animate-bounce' : ''}`}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                  {streakData.currentStreak}
                </div>
                <span className="absolute -top-1 -right-1 text-xl">{getStreakEmoji()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak!
                  </span>
                  {isNewMilestone && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                      NEW MILESTONE!
                    </span>
                  )}
                </div>
                <p className="text-navy-300 text-sm">{getMessage()}</p>
              </div>
            </div>

            {/* Progress to Next Milestone */}
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Progress to {next} days</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-white font-bold">{streakData.totalVisits}</div>
                <div className="text-navy-400 text-xs">Total Visits</div>
              </div>
              <div>
                <div className="text-white font-bold">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}