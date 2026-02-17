'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Start your learning journey today! 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🌱" },
  { min: 3, max: 6, message: "You're building a habit! Amazing progress!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "⚡" },
  { min: 14, max: 29, message: "Two weeks of dedication! You're a star learner!", emoji: "⭐" },
  { min: 30, max: 59, message: "A whole month! Your commitment is inspiring!", emoji: "🏆" },
  { min: 60, max: 89, message: "Two months! You're a learning legend!", emoji: "👑" },
  { min: 90, max: Infinity, message: "90+ days! You're absolutely incredible!", emoji: "🎯" },
]

const MILESTONE_STREAKS = [3, 7, 14, 30, 60, 90, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  const createConfetti = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa']
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
        opacity: 0;
      `
      confettiContainer.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 4000)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday - continue streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone
        if (MILESTONE_STREAKS.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowConfetti(true)
        }
      } else {
        // Streak broken - start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
      const timer = setTimeout(() => {
        setShowConfetti(false)
        setIsNewMilestone(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, createConfetti])

  if (!mounted || !streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const motivationalData = MOTIVATIONAL_MESSAGES.find(
    m => streakData.currentStreak >= m.min && streakData.currentStreak <= m.max
  ) || MOTIVATIONAL_MESSAGES[0]

  return (
    <div className="relative">
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        aria-hidden="true"
      />
      
      {/* Streak Card */}
      <div className={`card p-6 transition-all duration-500 ${isNewMilestone ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-950' : ''}`}>
        <div className="flex items-center justify-between">
          {/* Left side - Streak info */}
          <div className="flex items-center gap-4">
            {/* Animated Fire Icon */}
            <div className="relative">
              <div className={`text-5xl ${streakData.currentStreak > 0 ? 'animate-bounce' : ''}`}>
                {streakData.currentStreak === 0 ? '❄️' : streakData.currentStreak < 7 ? '🔥' : streakData.currentStreak < 30 ? '⚡' : '👑'}
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-ping" />
              )}
            </div>
            
            {/* Streak Details */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-lg">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-sm text-navy-400">Learning Streak</p>
            </div>
          </div>
          
          {/* Right side - Stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-semibold text-primary-400">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-500">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-primary-400">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-500">Total Visits</div>
            </div>
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{motivationalData.emoji}</span>
            <p className="text-navy-300 text-sm">{motivationalData.message}</p>
          </div>
        </div>
        
        {/* Milestone Progress */}
        {streakData.currentStreak > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-500 mb-2">
              <span>Next milestone</span>
              <span>
                {(() => {
                  const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak)
                  return nextMilestone ? `${nextMilestone} days` : 'All milestones reached! 🎉'
                })()}
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(() => {
                    const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak)
                    const prevMilestone = [...MILESTONE_STREAKS].reverse().find(m => m <= streakData.currentStreak) || 0
                    if (!nextMilestone) return 100
                    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                    return Math.min(progress, 100)
                  })()}%`
                }}
              />
            </div>
          </div>
        )}
        
        {/* New Milestone Celebration */}
        {isNewMilestone && (
          <div className="mt-4 p-3 bg-primary-500/20 rounded-lg border border-primary-500/30 animate-pulse">
            <p className="text-primary-300 text-sm font-medium text-center">
              🎉 Congratulations! You hit a {streakData.currentStreak}-day streak milestone!
            </p>
          </div>
        )}
      </div>

      {/* CSS for confetti animation */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  )
}