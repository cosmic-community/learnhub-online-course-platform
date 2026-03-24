'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

const MILESTONES = [7, 14, 30, 60, 100, 365]

const MOTIVATIONAL_MESSAGES = [
  "Every expert was once a beginner! 🌱",
  "You're building something great! 💪",
  "Consistency is the key to mastery! 🔑",
  "Your future self will thank you! 🙌",
  "Small steps lead to big achievements! 🚀",
  "Keep the momentum going! ⚡",
  "Learning is a superpower! 🦸",
  "You're on fire! 🔥",
]

function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
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
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
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
  const [celebrationMilestone, setCelebrationMilestone] = useState(0)
  const [message, setMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const getRandomMessage = useCallback(() => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, no changes needed
      } else if (diffDays === 1) {
        // Consecutive day - increment streak!
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisitDate = today
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestone
        if (MILESTONES.includes(data.currentStreak)) {
          setCelebrationMilestone(data.currentStreak)
          setShowCelebration(true)
          setTimeout(() => {
            createConfetti()
          }, 100)
        }
      } else {
        // Streak broken
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisitDate = today
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    setMessage(getRandomMessage())
  }, [getRandomMessage])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progressToNext = ((streakData.currentStreak % (nextMilestone - (MILESTONES.find(m => m < streakData.currentStreak && MILESTONES.indexOf(m) === MILESTONES.indexOf(nextMilestone) - 1) || 0))) / nextMilestone) * 100

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
        
        @keyframes celebration-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes flame-flicker {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          25% { transform: scale(1.1) rotate(2deg); }
          50% { transform: scale(0.95) rotate(-1deg); }
          75% { transform: scale(1.05) rotate(1deg); }
        }
      `}</style>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-gradient-to-br from-navy-900 to-navy-950 border border-primary-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-primary-500/20"
            style={{ animation: 'celebration-pulse 0.5s ease-in-out infinite' }}
          >
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Amazing Achievement!
            </h2>
            <p className="text-xl text-primary-400 mb-4">
              {celebrationMilestone} Day Streak! 
            </p>
            <p className="text-navy-300 mb-6">
              {celebrationMilestone >= 100 
                ? "You're a true learning legend! 🏆" 
                : celebrationMilestone >= 30 
                  ? "Your dedication is inspiring! 🌟"
                  : "You're building an amazing habit! 💪"}
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Keep Learning!
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`card cursor-pointer transition-all duration-300 ${
          isExpanded ? 'p-6' : 'p-4'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* Flame Icon with Animation */}
          <div 
            className="relative"
            style={{ animation: streakData.currentStreak >= 7 ? 'flame-flicker 0.5s ease-in-out infinite' : 'none' }}
          >
            <span className={`text-4xl ${streakData.currentStreak >= 7 ? 'drop-shadow-lg' : ''}`}>
              {streakData.currentStreak >= 30 ? '🔥' : streakData.currentStreak >= 7 ? '✨' : '🌱'}
            </span>
            {streakData.currentStreak >= 100 && (
              <span className="absolute -top-1 -right-1 text-lg">👑</span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400 text-sm">day streak</span>
            </div>
            <div className="text-xs text-navy-500">
              {isExpanded ? 'Click to collapse' : 'Click for details'}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="text-right">
            <div className="text-sm text-primary-400 font-medium">
              Best: {streakData.longestStreak}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-navy-800 space-y-4">
            {/* Progress to Next Milestone */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Next milestone</span>
                <span className="text-primary-400 font-medium">{nextMilestone} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
              <div className="text-xs text-navy-500 mt-1">
                {nextMilestone - streakData.currentStreak} days to go!
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 text-center">
              <p className="text-primary-300 text-sm italic">{message}</p>
            </div>

            {/* Milestone Badges */}
            <div>
              <div className="text-xs text-navy-400 mb-2">Milestones</div>
              <div className="flex flex-wrap gap-2">
                {MILESTONES.map(milestone => (
                  <div
                    key={milestone}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      streakData.currentStreak >= milestone
                        ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/30'
                        : 'bg-navy-800 text-navy-500'
                    }`}
                  >
                    {milestone}d {streakData.currentStreak >= milestone && '✓'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}