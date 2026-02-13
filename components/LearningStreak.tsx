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
  { min: 0, max: 0, message: "Welcome! Start your learning journey today! 🚀", emoji: "👋" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going! 💪", emoji: "🔥" },
  { min: 3, max: 6, message: "You're on fire! Learning streak activated! 🔥", emoji: "⚡" },
  { min: 7, max: 13, message: "One week strong! You're building great habits! 🌟", emoji: "🏆" },
  { min: 14, max: 29, message: "Two weeks! You're a dedicated learner! 🎯", emoji: "💎" },
  { min: 30, max: 59, message: "One month! You're unstoppable! 🚀", emoji: "🌈" },
  { min: 60, max: Infinity, message: "Learning legend! You inspire us all! 👑", emoji: "🦄" },
]

const MILESTONES = [3, 7, 14, 30, 60, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMilestone, setCelebrationMilestone] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const createConfetti = useCallback(() => {
    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
    const container = document.getElementById('confetti-container')
    if (!container) return

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
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
      `
      container.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 4000)
    }
  }, [])

  useEffect(() => {
    const loadAndUpdateStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalVisits: 0,
        coursesViewed: []
      }
      
      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        data.totalVisits += 1
        
        if (lastVisitDate === yesterdayString) {
          // Consecutive day - increment streak
          data.currentStreak += 1
        } else if (lastVisitDate !== '') {
          // Streak broken - reset
          data.currentStreak = 1
        } else {
          // First visit ever
          data.currentStreak = 1
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        data.lastVisit = today
        
        // Check for milestone celebration
        if (MILESTONES.includes(data.currentStreak)) {
          setCelebrationMilestone(data.currentStreak)
          setShowCelebration(true)
          setTimeout(() => {
            createConfetti()
          }, 100)
          setTimeout(() => {
            setShowCelebration(false)
          }, 5000)
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
      
      setStreakData(data)
    }
    
    loadAndUpdateStreak()
  }, [createConfetti])

  const getMessage = () => {
    if (!streakData) return MOTIVATIONAL_MESSAGES[0]
    const streak = streakData.currentStreak
    return MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max) || MOTIVATIONAL_MESSAGES[0]
  }

  const getNextMilestone = () => {
    if (!streakData) return MILESTONES[0]
    return MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak + 10
  }

  const getProgressToMilestone = () => {
    if (!streakData) return 0
    const next = getNextMilestone()
    const prev = MILESTONES.filter(m => m < streakData.currentStreak).pop() || 0
    const progress = ((streakData.currentStreak - prev) / (next - prev)) * 100
    return Math.min(progress, 100)
  }

  if (!streakData || !isVisible) return null

  const message = getMessage()

  return (
    <>
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
      />
      
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900/95 backdrop-blur-lg border border-primary-500/50 rounded-3xl p-8 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {celebrationMilestone} Day Streak!
            </h2>
            <p className="text-primary-400 text-lg">
              Amazing dedication! Keep learning!
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {['🔥', '⭐', '🏆', '💎', '🚀'].map((emoji, i) => (
                <span 
                  key={i} 
                  className="text-2xl animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Streak Widget */}
      <div 
        className={`fixed bottom-24 left-4 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <div className="relative">
          {/* Close button */}
          {isExpanded && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center text-navy-400 hover:text-white transition-colors text-xs z-10"
              aria-label="Close streak widget"
            >
              ✕
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full bg-navy-900/95 backdrop-blur-lg border border-navy-700 hover:border-primary-500/50 rounded-2xl transition-all duration-300 text-left overflow-hidden shadow-xl ${
              isExpanded ? 'p-4' : 'p-3'
            }`}
          >
            {/* Collapsed View */}
            {!isExpanded && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="text-2xl">{message.emoji}</span>
                  {streakData.currentStreak > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {streakData.currentStreak}
                    </span>
                  )}
                </div>
                <span className="text-navy-300 text-sm font-medium">
                  {streakData.currentStreak} day streak
                </span>
              </div>
            )}
            
            {/* Expanded View */}
            {isExpanded && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-primary-500/25">
                    {message.emoji}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {streakData.currentStreak} Day Streak
                    </div>
                    <div className="text-navy-400 text-xs">
                      Keep it going!
                    </div>
                  </div>
                </div>
                
                {/* Motivational Message */}
                <p className="text-primary-400 text-sm font-medium">
                  {message.message}
                </p>
                
                {/* Progress to Next Milestone */}
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to {getNextMilestone()} days</span>
                    <span>{Math.round(getProgressToMilestone())}%</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToMilestone()}%` }}
                    />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                    <div className="text-white font-bold">{streakData.longestStreak}</div>
                    <div className="text-navy-400 text-xs">Best Streak</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                    <div className="text-white font-bold">{streakData.totalVisits}</div>
                    <div className="text-navy-400 text-xs">Total Visits</div>
                  </div>
                </div>
                
                {/* Milestone Badges */}
                <div>
                  <div className="text-xs text-navy-400 mb-2">Milestones</div>
                  <div className="flex gap-1 flex-wrap">
                    {MILESTONES.slice(0, 5).map((milestone) => (
                      <div
                        key={milestone}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          streakData.currentStreak >= milestone
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-navy-800/50 text-navy-500'
                        }`}
                      >
                        {milestone}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </button>
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
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </>
  )
}