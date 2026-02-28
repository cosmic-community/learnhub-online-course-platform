'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  lessonsViewed: number
  coursesStarted: string[]
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const createConfetti = useCallback(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
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
  }, [])

  useEffect(() => {
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
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
      @keyframes celebration-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      style.remove()
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
        totalDaysLearned: 0,
        lessonsViewed: 0,
        coursesStarted: []
      }
      
      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        if (lastVisitDate === yesterdayString) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          data.totalDaysLearned += 1
          
          // Check for milestone
          if (MILESTONES.includes(data.currentStreak)) {
            setShowCelebration(true)
            setCelebrationMessage(`🎉 ${data.currentStreak} Day Streak! You're on fire!`)
            createConfetti()
            setTimeout(() => setShowCelebration(false), 4000)
          }
        } else if (lastVisitDate === '') {
          // First ever visit
          data.currentStreak = 1
          data.totalDaysLearned = 1
          setShowCelebration(true)
          setCelebrationMessage('🚀 Welcome! Your learning journey begins!')
          createConfetti()
          setTimeout(() => setShowCelebration(false), 4000)
        } else {
          // Streak broken - reset
          data.currentStreak = 1
          data.totalDaysLearned += 1
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        data.lastVisit = new Date().toISOString()
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
      
      setStreakData(data)
    }
    
    loadAndUpdateStreak()
  }, [createConfetti])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '👑'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getNextMilestone = (streak: number): number | null => {
    return MILESTONES.find(m => m > streak) || null
  }

  const getProgressToNextMilestone = (streak: number): number => {
    const nextMilestone = getNextMilestone(streak)
    if (!nextMilestone) return 100
    
    const previousMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1] || 0
    const progress = ((streak - previousMilestone) / (nextMilestone - previousMilestone)) * 100
    return Math.min(progress, 100)
  }

  if (!streakData || !isVisible) return null

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div 
            className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl text-center"
            style={{ animation: 'celebration-glow 1s ease-in-out infinite' }}
          >
            <div className="text-4xl mb-2">{celebrationMessage.split(' ')[0]}</div>
            <div className="text-xl font-bold">{celebrationMessage.split(' ').slice(1).join(' ')}</div>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div 
        className={`fixed bottom-24 left-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <div 
          className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Collapsed View */}
          <div className="flex items-center gap-3 p-4">
            <div 
              className="text-3xl"
              style={{ animation: streakData.currentStreak >= 3 ? 'streak-pulse 2s ease-in-out infinite' : 'none' }}
            >
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {streakData.currentStreak}
                <span className="text-sm font-normal text-navy-400">day streak</span>
              </div>
              {!isExpanded && getNextMilestone(streakData.currentStreak) && (
                <div className="text-xs text-navy-500">
                  {getNextMilestone(streakData.currentStreak)! - streakData.currentStreak} days to next milestone
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className="ml-auto text-navy-500 hover:text-navy-300 transition-colors"
              aria-label="Hide streak widget"
            >
              ×
            </button>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="px-4 pb-4 border-t border-navy-800 pt-4 space-y-4">
              {/* Progress to next milestone */}
              {getNextMilestone(streakData.currentStreak) && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-navy-400">Next milestone</span>
                    <span className="text-primary-400 font-medium">
                      {getNextMilestone(streakData.currentStreak)} days
                    </span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToNextMilestone(streakData.currentStreak)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.totalDaysLearned}</div>
                  <div className="text-xs text-navy-400">Total Days</div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center text-sm text-navy-300 italic">
                {streakData.currentStreak === 1 && "Every journey starts with a single step! 🚀"}
                {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "You're building momentum! Keep going! 💪"}
                {streakData.currentStreak >= 7 && streakData.currentStreak < 14 && "One week strong! You're unstoppable! 🔥"}
                {streakData.currentStreak >= 14 && streakData.currentStreak < 30 && "Two weeks of dedication! Amazing! ⭐"}
                {streakData.currentStreak >= 30 && "You're a true learner! Inspiring! 🏆"}
              </div>

              {/* Close hint */}
              <div className="text-center text-xs text-navy-500">
                Click to collapse
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}