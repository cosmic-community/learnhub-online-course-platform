'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MILESTONES = [7, 14, 30, 60, 100, 365]

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f97316', '#ec4899']
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
    
    setTimeout(() => confetti.remove(), 5000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, don't increment
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterday) {
        // Visited yesterday, increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestone
        if (MILESTONES.includes(data.currentStreak)) {
          setMilestoneReached(data.currentStreak)
          setShowCelebration(true)
          setTimeout(() => {
            createConfetti()
          }, 500)
        }
      } else {
        // Streak broken, reset to 1
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
        setMilestoneReached(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData || !isVisible) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (streak: number) => {
    if (streak >= 100) return "Legendary learner! You're unstoppable!"
    if (streak >= 30) return "On fire! A whole month of learning!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "One week streak! You're building great habits!"
    if (streak >= 3) return "Great start! Keep the momentum going!"
    return "Welcome back! Every day counts!"
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progress = Math.min((streakData.currentStreak / nextMilestone) * 100, 100)

  return (
    <>
      {/* Confetti Animation Styles */}
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
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes celebration-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* Celebration Modal */}
      {showCelebration && milestoneReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br from-navy-800 to-navy-900 border border-primary-500/50 rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl shadow-primary-500/20"
            style={{ animation: 'celebration-bounce 0.5s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {milestoneReached} Day Streak!
            </h2>
            <p className="text-navy-300 mb-6">
              Amazing dedication! You've been learning for {milestoneReached} days in a row!
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="relative bg-gradient-to-r from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-navy-500 hover:text-navy-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative flex items-center gap-6">
          {/* Streak Fire Animation */}
          <div 
            className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center border-2 border-primary-500/30"
            style={{ animation: streakData.currentStreak >= 7 ? 'streak-pulse 2s ease-in-out infinite' : 'none' }}
          >
            <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400">day streak</span>
            </div>
            
            <p className="text-primary-400 text-sm mb-3">
              {getMotivationalMessage(streakData.currentStreak)}
            </p>

            {/* Progress to next milestone */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-navy-400">
                <span>Progress to {nextMilestone} days</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-4 pt-4 border-t border-navy-700/50 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
        </div>
      </div>
    </>
  )
}