'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const STREAK_KEY = 'learnhub_streak'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const createConfetti = useCallback(() => {
    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
    const confettiCount = 50
    
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
  }, [])

  useEffect(() => {
    // Add confetti animation keyframes
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
      @keyframes flame-flicker {
        0%, 100% { transform: scale(1) rotate(-3deg); }
        50% { transform: scale(1.1) rotate(3deg); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const today = getToday()
    const stored = localStorage.getItem(STREAK_KEY)
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const daysSinceVisit = getDaysBetween(data.lastVisit, today)
      
      if (data.lastVisit === today) {
        // Already visited today, no changes
        setStreak(data)
        return
      } else if (daysSinceVisit === 1) {
        // Consecutive day! Increase streak
        data.currentStreak += 1
        data.lastVisit = today
        data.totalVisits += 1
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestones
        const milestones = [7, 14, 30, 50, 100, 365]
        if (milestones.includes(data.currentStreak)) {
          setMilestoneReached(data.currentStreak)
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 4000)
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
    }
    
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    setStreak(data)
  }, [createConfetti])

  if (!streak) return null

  const getStreakEmoji = (days: number): string => {
    if (days >= 100) return '🏆'
    if (days >= 30) return '🔥'
    if (days >= 7) return '⚡'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number): string => {
    if (days >= 100) return 'Legendary learner!'
    if (days >= 30) return 'On fire! 🔥'
    if (days >= 7) return 'Great momentum!'
    if (days >= 3) return 'Building habits!'
    return 'Just starting!'
  }

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && milestoneReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-primary-500 rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {milestoneReached} Day Streak!
            </h2>
            <p className="text-navy-300 mb-4">
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

      {/* Streak Badge */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800/80 rounded-full cursor-pointer transition-all duration-300 hover:bg-navy-700/80 border border-navy-700 hover:border-primary-500/50"
          style={{
            animation: streak.currentStreak >= 7 ? 'streak-pulse 2s ease-in-out infinite' : 'none'
          }}
        >
          <span 
            className="text-lg"
            style={{
              animation: streak.currentStreak >= 3 ? 'flame-flicker 0.5s ease-in-out infinite' : 'none'
            }}
          >
            {getStreakEmoji(streak.currentStreak)}
          </span>
          <span className="text-sm font-semibold text-white">
            {streak.currentStreak}
          </span>
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div className="absolute top-full right-0 mt-2 w-56 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50">
            <div className="text-center mb-3">
              <div className="text-3xl mb-1">{getStreakEmoji(streak.currentStreak)}</div>
              <div className="text-lg font-bold text-white">{streak.currentStreak} Day Streak</div>
              <div className="text-sm text-primary-400">{getStreakMessage(streak.currentStreak)}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-navy-400">
                <span>Longest streak:</span>
                <span className="text-white font-medium">{streak.longestStreak} days</span>
              </div>
              <div className="flex justify-between text-navy-400">
                <span>Total visits:</span>
                <span className="text-white font-medium">{streak.totalVisits}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-navy-700 text-xs text-navy-500 text-center">
              Visit daily to keep your streak! 🔥
            </div>
          </div>
        )}
      </div>
    </>
  )
}