'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: string[]
}

const MOTIVATIONAL_MESSAGES = [
  { minStreak: 0, message: "Welcome! Start your learning journey today! 🚀" },
  { minStreak: 1, message: "You're back! Keep the momentum going! 💪" },
  { minStreak: 3, message: "3 days strong! You're building a habit! 🌱" },
  { minStreak: 7, message: "One week streak! You're on fire! 🔥" },
  { minStreak: 14, message: "Two weeks! You're unstoppable! ⚡" },
  { minStreak: 30, message: "A month of learning! You're a legend! 🏆" },
  { minStreak: 60, message: "60 days! You've mastered consistency! 👑" },
  { minStreak: 100, message: "100 DAYS! You're a learning machine! 🎯" },
]

const MILESTONES = [1, 3, 7, 14, 30, 60, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const createConfetti = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
    const confettiCount = 150

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
        animation-delay: ${Math.random() * 0.5}s;
        z-index: 9999;
        pointer-events: none;
      `
      confettiContainer.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 5500)
    }
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      coursesViewed: []
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
    const todayDate = new Date(today)

    if (data.lastVisit !== today) {
      // New day visit
      data.totalVisits += 1
      
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          const oldStreak = data.currentStreak
          data.currentStreak += 1
          
          // Check for new milestone
          if (MILESTONES.includes(data.currentStreak) && !MILESTONES.includes(oldStreak)) {
            setIsNewMilestone(true)
            setShowConfetti(true)
          }
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit ever
        data.currentStreak = 1
        setShowConfetti(true)
      }
      
      data.lastVisit = today
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
      const timer = setTimeout(() => {
        setShowConfetti(false)
        setIsNewMilestone(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, createConfetti])

  const getMessage = () => {
    if (!streakData) return MOTIVATIONAL_MESSAGES[0].message
    const streak = streakData.currentStreak
    
    for (let i = MOTIVATIONAL_MESSAGES.length - 1; i >= 0; i--) {
      if (streak >= MOTIVATIONAL_MESSAGES[i].minStreak) {
        return MOTIVATIONAL_MESSAGES[i].message
      }
    }
    return MOTIVATIONAL_MESSAGES[0].message
  }

  const getNextMilestone = () => {
    if (!streakData) return MILESTONES[0]
    const currentStreak = streakData.currentStreak
    return MILESTONES.find(m => m > currentStreak) || null
  }

  const getStreakEmoji = () => {
    if (!streakData) return '🌱'
    const streak = streakData.currentStreak
    if (streak >= 100) return '👑'
    if (streak >= 60) return '🏆'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '💪'
    if (streak >= 1) return '🌱'
    return '🌱'
  }

  if (!streakData || !isVisible) return null

  const nextMilestone = getNextMilestone()
  const progress = nextMilestone ? (streakData.currentStreak / nextMilestone) * 100 : 100

  return (
    <>
      {/* Confetti Container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />
      
      {/* Confetti CSS Animation */}
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
        
        @keyframes streak-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
        }
      `}</style>
      
      {/* Streak Widget */}
      <div 
        className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        {/* Collapsed View - Just the streak badge */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-primary-600 to-primary-500 
              text-white font-semibold shadow-lg 
              hover:from-primary-500 hover:to-primary-400
              transition-all duration-300
              ${isNewMilestone ? 'animate-bounce' : ''}
            `}
            style={isNewMilestone ? { animation: 'streak-pulse 0.5s ease-in-out infinite' } : {}}
          >
            <span className="text-xl">{getStreakEmoji()}</span>
            <span className="text-lg">{streakData.currentStreak}</span>
            <span className="text-xs opacity-80">day streak</span>
          </button>
        )}
        
        {/* Expanded View */}
        {isExpanded && (
          <div 
            className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
            style={isNewMilestone ? { animation: 'glow 1s ease-in-out infinite' } : {}}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getStreakEmoji()}</span>
                <div>
                  <div className="text-white font-bold text-lg">
                    {streakData.currentStreak} Day Streak!
                  </div>
                  {isNewMilestone && (
                    <div className="text-white/90 text-xs animate-pulse">
                      🎉 New Milestone Reached!
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white p-1"
                aria-label="Collapse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Motivational Message */}
              <p className="text-navy-200 text-sm text-center">
                {getMessage()}
              </p>
              
              {/* Progress to Next Milestone */}
              {nextMilestone && (
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to {nextMilestone} days</span>
                    <span>{streakData.currentStreak}/{nextMilestone}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
              </div>
              
              {/* Tips */}
              <div className="text-center pt-2 border-t border-navy-800">
                <p className="text-xs text-navy-500">
                  💡 Tip: Visit daily to build your streak!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}