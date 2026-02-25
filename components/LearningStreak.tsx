'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { minStreak: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { minStreak: 1, message: "Great start! You're on your way! 💪", emoji: "⭐" },
  { minStreak: 3, message: "3 days strong! Keep the momentum! 🔥", emoji: "🔥" },
  { minStreak: 7, message: "One week streak! You're unstoppable! 🏆", emoji: "🏆" },
  { minStreak: 14, message: "Two weeks! Learning machine mode! 🤖", emoji: "💎" },
  { minStreak: 30, message: "30 day legend! You're inspiring! 👑", emoji: "👑" },
  { minStreak: 60, message: "60 days! You're a true champion! 🌟", emoji: "🌟" },
  { minStreak: 100, message: "100 DAYS! LEGENDARY STATUS! 🎯", emoji: "🎯" },
]

const MILESTONES = [3, 7, 14, 30, 60, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  const createConfetti = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

    const colors = ['#29ABE2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        z-index: 9999;
        pointer-events: none;
      `
      confettiContainer.appendChild(confetti)

      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, don't update streak
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const wasMilestone = MILESTONES.includes(data.currentStreak)
        const isMilestone = MILESTONES.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        
        if (isMilestone && !wasMilestone) {
          setIsNewMilestone(true)
          setShowConfetti(true)
        }
      } else {
        // Streak broken, start new streak
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      setShowConfetti(true)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    if (showConfetti && mounted) {
      createConfetti()
      const timer = setTimeout(() => {
        setShowConfetti(false)
        setIsNewMilestone(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, mounted, createConfetti])

  if (!mounted || !streakData) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700">
        <span className="text-2xl">🔥</span>
        <span className="text-navy-300 text-sm">Loading...</span>
      </div>
    )
  }

  const getMessage = () => {
    const applicable = MOTIVATIONAL_MESSAGES
      .filter(m => streakData.currentStreak >= m.minStreak)
      .pop()
    return applicable || MOTIVATIONAL_MESSAGES[0]
  }

  const { message, emoji } = getMessage()
  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak + 1
  const progress = ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100

  return (
    <>
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />
      
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
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(41, 171, 226, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(41, 171, 226, 0.6);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .streak-card {
          animation: ${isNewMilestone ? 'pulse-glow 1s ease-in-out infinite' : 'none'};
        }
        
        .streak-emoji {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="streak-card group relative inline-flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-navy-800/80 to-navy-900/80 rounded-2xl border border-navy-700 hover:border-primary-500/50 transition-all duration-300 cursor-default">
        {/* Milestone badge */}
        {isNewMilestone && (
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white text-xs font-bold animate-bounce">
            🎉 NEW MILESTONE!
          </div>
        )}
        
        {/* Main streak display */}
        <div className="flex items-center gap-3">
          <span className="streak-emoji text-4xl">{emoji}</span>
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-primary-400 text-xs font-medium">Learning Streak</span>
          </div>
        </div>
        
        {/* Motivational message */}
        <p className="text-navy-300 text-sm text-center max-w-[200px]">{message}</p>
        
        {/* Progress bar to next milestone */}
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs text-navy-500 mb-1">
            <span>Progress</span>
            <span>Next: {nextMilestone} days</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Stats on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div className="flex gap-4 text-xs">
            <div className="text-center">
              <div className="text-white font-bold">{streakData.longestStreak}</div>
              <div className="text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">{streakData.totalVisits}</div>
              <div className="text-navy-400">Total Visits</div>
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-navy-700" />
        </div>
      </div>
    </>
  )
}