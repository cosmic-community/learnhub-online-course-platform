'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  visitDates: string[]
}

const MOTIVATIONAL_MESSAGES = [
  "🚀 You're on fire! Keep learning!",
  "⭐ Consistency is the key to mastery!",
  "💪 Every day you learn, you grow!",
  "🎯 Stay focused, stay curious!",
  "🌟 You're building something amazing!",
  "🔥 Your dedication is inspiring!",
  "📚 Knowledge compounds over time!",
  "✨ Great things take time and effort!",
]

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const triggerConfetti = useCallback(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`
      confetti.style.animationDelay = `${Math.random() * 0.5}s`
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 4000)
    }
  }, [])

  useEffect(() => {
    const initStreak = () => {
      const today = new Date().toISOString().split('T')[0]
      const stored = localStorage.getItem('learnhub-streak')
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalVisits: 0,
        visitDates: []
      }

      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
      const todayDate = new Date(today)
      
      if (data.lastVisit !== today) {
        data.totalVisits++
        
        if (lastVisitDate) {
          const diffTime = todayDate.getTime() - lastVisitDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            // Consecutive day - increase streak
            data.currentStreak++
            if (data.currentStreak > data.longestStreak) {
              data.longestStreak = data.currentStreak
            }
            
            // Check for milestone celebration
            if (STREAK_MILESTONES.includes(data.currentStreak)) {
              setShowCelebration(true)
              triggerConfetti()
              setTimeout(() => setShowCelebration(false), 3000)
            }
          } else if (diffDays > 1) {
            // Streak broken
            data.currentStreak = 1
          }
        } else {
          // First visit
          data.currentStreak = 1
        }
        
        data.lastVisit = today
        if (!data.visitDates.includes(today)) {
          data.visitDates.push(today)
          // Keep only last 30 days
          if (data.visitDates.length > 30) {
            data.visitDates = data.visitDates.slice(-30)
          }
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }

      setStreakData(data)
      setMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
      
      // Animate in after a short delay
      setTimeout(() => setIsVisible(true), 500)
    }

    initStreak()
  }, [triggerConfetti])

  if (!streakData || !isVisible) return null

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '👑'
    if (streakData.currentStreak >= 14) return '🔥'
    if (streakData.currentStreak >= 7) return '⭐'
    if (streakData.currentStreak >= 3) return '🌟'
    return '✨'
  }

  const getStreakColor = () => {
    if (streakData.currentStreak >= 30) return 'from-yellow-500 to-orange-500'
    if (streakData.currentStreak >= 14) return 'from-orange-500 to-red-500'
    if (streakData.currentStreak >= 7) return 'from-primary-500 to-purple-500'
    return 'from-primary-400 to-primary-600'
  }

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce-in bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-2xl font-bold">{streakData.currentStreak} Day Streak!</div>
            <div className="text-sm opacity-90 mt-1">Amazing dedication!</div>
          </div>
        </div>
      )}

      {/* Streak widget */}
      <div
        className={`fixed bottom-24 left-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full bg-gradient-to-r ${getStreakColor()} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white text-left ${
            streakData.currentStreak >= 7 ? 'animate-pulse-glow' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-float">{getStreakEmoji()}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg">
                {streakData.currentStreak} Day Streak
              </div>
              {isExpanded && (
                <div className="text-sm opacity-90 truncate">{message}</div>
              )}
            </div>
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/20 space-y-3 animate-bounce-in">
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Longest Streak</span>
                <span className="font-semibold">{streakData.longestStreak} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Total Visits</span>
                <span className="font-semibold">{streakData.totalVisits}</span>
              </div>
              
              {/* Mini calendar - last 7 days */}
              <div className="mt-3">
                <div className="text-xs opacity-80 mb-2">Last 7 Days</div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - (6 - i))
                    const dateStr = date.toISOString().split('T')[0]
                    const visited = streakData.visitDates.includes(dateStr)
                    
                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                          visited
                            ? 'bg-white/30 text-white'
                            : 'bg-white/10 text-white/50'
                        }`}
                        title={dateStr}
                      >
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Next milestone */}
              {(() => {
                const nextMilestone = STREAK_MILESTONES.find(m => m > streakData.currentStreak)
                if (!nextMilestone) return null
                const progress = (streakData.currentStreak / nextMilestone) * 100
                
                return (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="opacity-80">Next milestone</span>
                      <span>{nextMilestone} days</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full progress-animated"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </button>
      </div>
    </>
  )
}