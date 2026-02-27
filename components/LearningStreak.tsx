'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const createConfetti = useCallback(() => {
    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']
    const confettiCount = 50
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      `
      document.body.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 4000)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just load data
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak!
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today
        
        // Check for milestone
        if (MILESTONES.includes(data.currentStreak)) {
          setMilestone(data.currentStreak)
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 5000)
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
      } else {
        // Streak broken, restart
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = today
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [createConfetti])

  if (!streakData || !isVisible) return null

  const getStreakMessage = () => {
    if (streakData.currentStreak >= 30) return "You're on fire! 🔥 Legendary learner!"
    if (streakData.currentStreak >= 14) return "Two weeks strong! 💪 Keep crushing it!"
    if (streakData.currentStreak >= 7) return "One week streak! 🌟 You're amazing!"
    if (streakData.currentStreak >= 3) return "Great momentum! 🚀 Keep it up!"
    if (streakData.currentStreak === 1) return "Welcome back! 👋 Start your streak today!"
    return "Nice streak! 🎯 Stay consistent!"
  }

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return "🏆"
    if (streakData.currentStreak >= 14) return "⭐"
    if (streakData.currentStreak >= 7) return "🔥"
    if (streakData.currentStreak >= 3) return "✨"
    return "🎯"
  }

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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes celebration-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
        }
      `}</style>

      {/* Milestone Celebration Modal */}
      {showCelebration && milestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-navy-900 border-2 border-yellow-500/50 rounded-2xl p-8 text-center max-w-md mx-4"
            style={{ animation: 'celebration-glow 1s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {milestone} Day Streak!
            </h2>
            <p className="text-navy-300 mb-4">
              You&apos;ve been learning for {milestone} days in a row! That&apos;s incredible dedication.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: Math.min(milestone, 7) }).map((_, i) => (
                <span key={i} className="text-2xl">🔥</span>
              ))}
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 bg-navy-700/50 rounded-full px-4 py-2"
                style={{ animation: streakData.currentStreak >= 3 ? 'streak-pulse 2s ease-in-out infinite' : 'none' }}
              >
                <span className="text-2xl">{getStreakEmoji()}</span>
                <span className="font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
              </div>
              <span className="text-navy-300 text-sm hidden sm:inline">
                {getStreakMessage()}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-navy-400">
                <span>Best: <strong className="text-white">{streakData.longestStreak}</strong> days</span>
                <span>•</span>
                <span>Total visits: <strong className="text-white">{streakData.totalVisits}</strong></span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-navy-500 hover:text-navy-300 transition-colors"
                aria-label="Dismiss streak banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}