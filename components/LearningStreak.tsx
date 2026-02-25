'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { minStreak: 0, message: "Start your learning journey today! 🚀" },
  { minStreak: 1, message: "Great start! Keep the momentum going! 💪" },
  { minStreak: 3, message: "3 days strong! You're building a habit! 🌱" },
  { minStreak: 7, message: "One week streak! You're on fire! 🔥" },
  { minStreak: 14, message: "Two weeks! You're unstoppable! ⚡" },
  { minStreak: 30, message: "30 days! You're a learning machine! 🏆" },
  { minStreak: 60, message: "60 days! Legendary dedication! 👑" },
  { minStreak: 100, message: "100 days! You're an inspiration! 🌟" },
]

const MILESTONES = [3, 7, 14, 30, 60, 100]

function createConfetti() {
  const colors = ['#29ABE2', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181']
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
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just show current streak
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        
        // Check if this is a new milestone
        if (MILESTONES.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowCelebration(true)
          setTimeout(() => {
            createConfetti()
          }, 500)
        }
        
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: newLongest,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
      } else {
        // Missed a day, reset streak
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
      setShowCelebration(true)
    }
  }, [])

  const getMessage = (streak: number): string => {
    let message = MOTIVATIONAL_MESSAGES[0].message
    for (const m of MOTIVATIONAL_MESSAGES) {
      if (streak >= m.minStreak) {
        message = m.message
      }
    }
    return message
  }

  if (!streakData) return null

  return (
    <>
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
        
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes flame {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
          }
          50% {
            transform: scaleY(1.1) scaleX(0.9);
          }
        }
      `}</style>
      
      <div 
        className={`relative bg-gradient-to-r from-navy-900/80 to-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 overflow-hidden transition-all duration-500 ${
          showCelebration ? 'animate-pulse' : ''
        }`}
        style={{
          animation: isNewMilestone ? 'pulse-glow 2s ease-in-out infinite' : undefined
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-2xl" />
        
        <div className="relative flex items-center gap-6">
          {/* Streak Fire Icon */}
          <div 
            className="relative flex-shrink-0"
            style={{
              animation: streakData.currentStreak >= 3 ? 'flame 0.5s ease-in-out infinite' : undefined
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-3xl" role="img" aria-label="fire">
                {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'}
              </span>
            </div>
            {streakData.currentStreak >= 7 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-navy-900 shadow-lg">
                🏆
              </div>
            )}
          </div>
          
          {/* Streak Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"
                style={{
                  animation: 'bounce-in 0.5s ease-out'
                }}
              >
                {streakData.currentStreak}
              </span>
              <span className="text-navy-300 text-lg">
                day{streakData.currentStreak !== 1 ? 's' : ''} streak
              </span>
            </div>
            <p className="text-navy-400 text-sm truncate">
              {getMessage(streakData.currentStreak)}
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-navy-400 text-xs uppercase tracking-wide">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-navy-400 text-xs uppercase tracking-wide">Visits</div>
            </div>
          </div>
        </div>
        
        {/* Progress to next milestone */}
        {streakData.currentStreak < 100 && (
          <div className="mt-4 pt-4 border-t border-navy-700/50">
            {(() => {
              const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) ?? 100
              const prevMilestone = MILESTONES.slice().reverse().find(m => m <= streakData.currentStreak) ?? 0
              const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
              const daysToGo = nextMilestone - streakData.currentStreak
              
              return (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-navy-400">
                    <span>{daysToGo} day{daysToGo !== 1 ? 's' : ''} to {nextMilestone}-day milestone</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })()}
          </div>
        )}
        
        {/* Celebration Badge for Milestones */}
        {isNewMilestone && (
          <div 
            className="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-navy-900 text-xs font-bold rounded-full shadow-lg"
            style={{ animation: 'bounce-in 0.5s ease-out' }}
          >
            🎉 NEW MILESTONE!
          </div>
        )}
      </div>
    </>
  )
}