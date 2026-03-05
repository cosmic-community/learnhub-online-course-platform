'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀" },
  { min: 1, max: 2, message: "Great start! Keep it up! 💪" },
  { min: 3, max: 6, message: "You're building a habit! 🌱" },
  { min: 7, max: 13, message: "One week strong! Amazing! 🔥" },
  { min: 14, max: 29, message: "Two weeks! You're unstoppable! ⚡" },
  { min: 30, max: 59, message: "30-day warrior! Incredible! 🏆" },
  { min: 60, max: 89, message: "60 days! You're a legend! 👑" },
  { min: 90, max: Infinity, message: "Master learner! Keep shining! ✨" },
]

const MILESTONES = [7, 14, 30, 60, 90, 100, 365]

function createConfetti(): void {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
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
      opacity: ${Math.random() * 0.7 + 0.3};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

function getMotivationalMessage(streak: number): string {
  const messageObj = MOTIVATIONAL_MESSAGES.find(
    m => streak >= m.min && streak <= m.max
  )
  return messageObj?.message ?? "Keep learning! 📚"
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, no update needed
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayStr) {
        // Continuing streak!
        data.currentStreak += 1
        data.lastVisit = today
        data.totalVisits += 1
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestone
        if (MILESTONES.includes(data.currentStreak)) {
          setIsNewMilestone(true)
          setCelebrationMessage(`🎉 ${data.currentStreak}-day streak! You're amazing!`)
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 5000)
        }
      } else {
        // Streak broken, reset
        data.currentStreak = 1
        data.lastVisit = today
        data.totalVisits += 1
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1
      }
      setCelebrationMessage('🎉 Welcome! Your learning journey begins!')
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    // Small delay to ensure client-side hydration
    const timer = setTimeout(checkAndUpdateStreak, 100)
    return () => clearTimeout(timer)
  }, [checkAndUpdateStreak])

  useEffect(() => {
    if (isNewMilestone) {
      const timer = setTimeout(() => setIsNewMilestone(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isNewMilestone])

  if (!streakData) return null

  const message = getMotivationalMessage(streakData.currentStreak)

  return (
    <>
      {/* Confetti animation styles */}
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
            transform: scale(1.1);
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

      {/* Celebration Banner */}
      {showCelebration && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-2xl shadow-primary-500/30"
          style={{ animation: 'celebration-bounce 0.5s ease-in-out infinite' }}
        >
          <p className="text-lg font-bold text-center">{celebrationMessage}</p>
        </div>
      )}

      {/* Streak Badge */}
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
            isNewMilestone 
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
              : 'bg-navy-800/80 hover:bg-navy-700/80 text-white'
          }`}
          style={isNewMilestone ? { animation: 'streak-pulse 0.5s ease-in-out infinite' } : {}}
        >
          <span className="text-xl">🔥</span>
          <span className="font-bold text-lg">{streakData.currentStreak}</span>
          <span className="hidden sm:inline text-sm text-navy-300">
            {streakData.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl z-50">
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl mb-1">🔥 {streakData.currentStreak} Day Streak!</p>
                <p className="text-sm text-primary-400">{message}</p>
              </div>
              
              <div className="border-t border-navy-700 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Longest streak:</span>
                  <span className="text-white font-medium">{streakData.longestStreak} days 🏆</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Total visits:</span>
                  <span className="text-white font-medium">{streakData.totalVisits} 📚</span>
                </div>
              </div>

              {/* Progress to next milestone */}
              {(() => {
                const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak)
                if (!nextMilestone) return null
                const prevMilestone = MILESTONES.filter(m => m <= streakData.currentStreak).pop() ?? 0
                const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                
                return (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-navy-400">Next milestone:</span>
                      <span className="text-primary-400">{nextMilestone} days</span>
                    </div>
                    <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}