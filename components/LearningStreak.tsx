'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearning: number
  lessonsCompleted: number
}

const MILESTONE_MESSAGES: Record<number, string> = {
  1: "Great start! Your learning journey begins! 🚀",
  3: "3 days strong! You're building a habit! 💪",
  7: "One week streak! You're unstoppable! 🔥",
  14: "Two weeks! You're a dedicated learner! ⭐",
  30: "30 days! You're a learning champion! 🏆",
  50: "50 days! Legendary dedication! 👑",
  100: "100 DAYS! You're absolutely incredible! 🎉",
}

function getMotivationalMessage(streak: number): string {
  const milestones = Object.keys(MILESTONE_MESSAGES).map(Number).sort((a, b) => b - a)
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return MILESTONE_MESSAGES[milestone] ?? "Keep learning!"
    }
  }
  return "Start your streak today! 📚"
}

function createConfetti(): void {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

// Add confetti animation styles
function addConfettiStyles(): void {
  if (document.getElementById('confetti-styles')) return
  
  const style = document.createElement('style')
  style.id = 'confetti-styles'
  style.textContent = `
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
    @keyframes streak-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes ring-fill {
      from { stroke-dashoffset: 283; }
    }
  `
  document.head.appendChild(style)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: '',
      totalDaysLearning: 0,
      lessonsCompleted: 0,
    }

    if (data.lastVisitDate === today) {
      // Already visited today
      setStreakData(data)
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const previousStreak = data.currentStreak

    if (data.lastVisitDate === yesterdayStr) {
      // Continuing streak
      data.currentStreak += 1
    } else if (data.lastVisitDate === '') {
      // First visit ever
      data.currentStreak = 1
    } else {
      // Streak broken
      data.currentStreak = 1
    }

    data.lastVisitDate = today
    data.totalDaysLearning += 1
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak)

    // Check for milestone celebration
    const milestones = [1, 3, 7, 14, 30, 50, 100]
    const hitMilestone = milestones.includes(data.currentStreak) && data.currentStreak > previousStreak

    if (hitMilestone) {
      setIsNewMilestone(true)
      setShowCelebration(true)
      setTimeout(() => {
        createConfetti()
      }, 100)
      setTimeout(() => {
        setShowCelebration(false)
        setIsNewMilestone(false)
      }, 4000)
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    addConfettiStyles()
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const progressPercentage = Math.min((streakData.currentStreak / 30) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div 
      className={`relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 transition-all duration-500 ${
        showCelebration ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
      }`}
      style={{
        animation: showCelebration ? 'streak-pulse 0.5s ease-in-out infinite' : 'none'
      }}
    >
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-yellow-500/10 rounded-2xl animate-pulse" />
      )}

      <div className="relative flex items-center gap-6">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-navy-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#streak-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                animation: 'ring-fill 1.5s ease-out forwards'
              }}
            />
            <defs>
              <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
            <span className="text-xs text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>
          
          {/* Fire emoji for active streaks */}
          {streakData.currentStreak >= 3 && (
            <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
              🔥
            </div>
          )}
        </div>

        {/* Stats and Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">
              {isNewMilestone ? '🎉 Milestone Reached!' : 'Learning Streak'}
            </h3>
            {streakData.currentStreak >= 7 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full border border-amber-500/30">
                On Fire!
              </span>
            )}
          </div>
          
          <p className="text-sm text-navy-300 mb-3 line-clamp-2">
            {getMotivationalMessage(streakData.currentStreak)}
          </p>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-navy-400">Best: <span className="text-white font-medium">{streakData.longestStreak} days</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-navy-400">Total: <span className="text-white font-medium">{streakData.totalDaysLearning} days</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar to next milestone */}
      <div className="mt-4 pt-4 border-t border-navy-700/50">
        <div className="flex items-center justify-between text-xs text-navy-400 mb-2">
          <span>Progress to 30-day badge</span>
          <span className="text-primary-400 font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}