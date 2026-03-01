'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

const MILESTONE_STREAKS = [3, 7, 14, 30, 50, 100]

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
    duration: number
  }>>([])

  const triggerConfetti = useCallback(() => {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#22c55e',
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }))
    setConfettiPieces(pieces)
    
    setTimeout(() => {
      setConfettiPieces([])
    }, 5000)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData) as StreakData
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day - no update needed
        setStreakData(data)
        return
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = data.currentStreak + 1
        const isNewMilestone = MILESTONE_STREAKS.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
        
        if (isNewMilestone) {
          setCelebrationMessage(getCelebrationMessage(newStreak))
          setShowCelebration(true)
          triggerConfetti()
        }
      } else {
        // Streak broken - reset to 1
        data = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
      }
      setCelebrationMessage('🎉 Welcome to LearnHub! Your learning journey begins today!')
      setShowCelebration(true)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [triggerConfetti])

  const getCelebrationMessage = (streak: number): string => {
    switch (streak) {
      case 3:
        return '🔥 3 Day Streak! You\'re building momentum!'
      case 7:
        return '🌟 One Week Streak! You\'re on fire!'
      case 14:
        return '💪 Two Weeks Strong! Incredible dedication!'
      case 30:
        return '🏆 30 Day Streak! You\'re a learning champion!'
      case 50:
        return '👑 50 Day Streak! Absolutely legendary!'
      case 100:
        return '🚀 100 DAY STREAK! You\'re unstoppable!'
      default:
        return `🎯 ${streak} Day Streak! Keep it up!`
    }
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '🚀'
    if (streak >= 50) return '👑'
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '💪'
    if (streak >= 7) return '🌟'
    if (streak >= 3) return '🔥'
    return '✨'
  }

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-purple-400 to-pink-500'
    if (streak >= 7) return 'from-blue-400 to-cyan-500'
    if (streak >= 3) return 'from-green-400 to-emerald-500'
    return 'from-primary-400 to-primary-600'
  }

  if (!streakData) return null

  return (
    <>
      {/* Confetti Animation */}
      {confettiPieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${piece.x}%`,
                top: '-20px',
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-[90] bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce-in shadow-2xl">
            <div className="text-6xl mb-4">{getStreakEmoji(streakData.currentStreak)}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{celebrationMessage}</h2>
            <p className="text-navy-300 mb-6">
              Keep coming back daily to maintain your streak and unlock more achievements!
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Streak Display Widget */}
      <div className="relative group">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} shadow-lg cursor-pointer transition-transform hover:scale-105`}>
          <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
          <div className="text-white">
            <div className="font-bold text-lg leading-tight">{streakData.currentStreak}</div>
            <div className="text-xs opacity-90">day streak</div>
          </div>
        </div>
        
        {/* Tooltip with more stats */}
        <div className="absolute top-full right-0 mt-2 w-56 bg-navy-900 border border-navy-700 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Current Streak</span>
              <span className="text-white font-semibold">{streakData.currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Longest Streak</span>
              <span className="text-primary-400 font-semibold">{streakData.longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400 text-sm">Total Visits</span>
              <span className="text-white font-semibold">{streakData.totalVisits}</span>
            </div>
            <div className="pt-2 border-t border-navy-700">
              <div className="text-xs text-navy-400 text-center">
                Visit daily to keep your streak! 🔥
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}