'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  recentCourses: string[]
}

const MILESTONE_DAYS = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const createConfetti = useCallback(() => {
    const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;'
    document.body.appendChild(container)

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 10 + 5
      const left = Math.random() * 100
      const delay = Math.random() * 2
      const duration = Math.random() * 2 + 2

      confetti.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        background:${color};
        left:${left}%;
        top:-20px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation:confetti-fall ${duration}s ease-out ${delay}s forwards;
        transform:rotate(${Math.random() * 360}deg);
      `
      container.appendChild(confetti)
    }

    setTimeout(() => container.remove(), 5000)
  }, [])

  useEffect(() => {
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes streak-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      @keyframes streak-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
        50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.6); }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: '',
      totalDaysLearned: 0,
      recentCourses: []
    }

    const lastVisit = data.lastVisitDate
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    if (lastVisit !== today) {
      if (lastVisit === yesterdayString) {
        // Consecutive day - increment streak
        data.currentStreak += 1
        data.totalDaysLearned += 1
        
        // Check for milestone
        if (MILESTONE_DAYS.includes(data.currentStreak)) {
          setMilestoneReached(data.currentStreak)
          setShowCelebration(true)
          setTimeout(() => createConfetti(), 500)
        }
      } else if (lastVisit !== today) {
        // Streak broken or first visit
        if (data.currentStreak > 0) {
          // Streak was broken
          data.currentStreak = 1
        } else {
          // First visit ever
          data.currentStreak = 1
        }
        data.totalDaysLearned += 1
      }

      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      data.lastVisitDate = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [createConfetti])

  // Dismiss celebration
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🌟'
    if (streak >= 3) return '✨'
    return '🎯'
  }

  const getNextMilestone = (current: number) => {
    return MILESTONE_DAYS.find(m => m > current) || null
  }

  const nextMilestone = getNextMilestone(streakData.currentStreak)
  const progress = nextMilestone 
    ? ((streakData.currentStreak % (nextMilestone - (MILESTONE_DAYS[MILESTONE_DAYS.indexOf(nextMilestone) - 1] || 0))) / 
       (nextMilestone - (MILESTONE_DAYS[MILESTONE_DAYS.indexOf(nextMilestone) - 1] || 0))) * 100
    : 100

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && milestoneReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-center max-w-sm mx-4 transform animate-bounce"
            style={{ animation: 'streak-pulse 0.5s ease-in-out' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {milestoneReached} Day Streak!
            </h2>
            <p className="text-primary-100 mb-4">
              You're on fire! Keep up the amazing learning journey!
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed top-24 right-4 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            bg-gradient-to-r from-primary-600 to-primary-700 
            rounded-2xl shadow-lg shadow-primary-500/20 
            transition-all duration-300 hover:shadow-primary-500/40
            ${isExpanded ? 'w-full' : 'px-4 py-3'}
          `}
          style={streakData.currentStreak >= 7 ? { animation: 'streak-glow 2s ease-in-out infinite' } : {}}
        >
          {isExpanded ? (
            <div className="p-4 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</span>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                    </div>
                    <div className="text-primary-200 text-sm">Current Streak</div>
                  </div>
                </div>
                <span className="text-primary-200 text-xl">×</span>
              </div>

              {/* Progress to next milestone */}
              {nextMilestone && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-primary-200 mb-1">
                    <span>Next milestone</span>
                    <span>{nextMilestone} days</span>
                  </div>
                  <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-primary-800/50 rounded-lg p-2">
                  <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-primary-300 text-xs">Best Streak</div>
                </div>
                <div className="bg-primary-800/50 rounded-lg p-2">
                  <div className="text-xl font-bold text-white">{streakData.totalDaysLearned}</div>
                  <div className="text-primary-300 text-xs">Total Days</div>
                </div>
              </div>

              <p className="text-primary-200 text-xs mt-3 text-center">
                {streakData.currentStreak === 0 
                  ? "Start learning to build your streak!"
                  : streakData.currentStreak < 3
                  ? "Keep it up! 3-day milestone coming soon!"
                  : nextMilestone
                  ? `${nextMilestone - streakData.currentStreak} more day${nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} to next milestone!`
                  : "You're a learning legend! 🏆"}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
              <span className="text-white font-bold">{streakData.currentStreak}</span>
            </div>
          )}
        </button>
      </div>
    </>
  )
}