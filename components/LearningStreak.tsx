'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Get stored streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Continuing streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, newStreak)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Celebrate milestones!
        if (newStreak % 5 === 0 || newStreak === 3) {
          setShowCelebration(true)
          triggerConfetti()
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
    }
    
    // Show widget after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const triggerConfetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
    const confettiCount = 50
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
      confetti.style.animationDelay = Math.random() * 0.5 + 's'
      document.body.appendChild(confetti)
      
      setTimeout(() => confetti.remove(), 4000)
    }
  }

  if (!streakData || !isVisible) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '💎'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '🔥'
    return '✨'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'Week warrior!'
    if (streak >= 3) return 'On fire!'
    if (streak === 1) return 'Day one!'
    return 'Keep it up!'
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 left-5 z-40 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce-in"
        aria-label="Show learning streak"
      >
        <span className="text-2xl animate-fire">{getStreakEmoji(streakData.currentStreak)}</span>
      </button>
    )
  }

  return (
    <div 
      className={`fixed bottom-24 left-5 z-40 animate-bounce-in ${streakData.currentStreak >= 3 ? 'animate-pulse-glow' : ''}`}
    >
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 border border-navy-700 rounded-2xl p-4 shadow-xl min-w-[200px]">
        {/* Close/Minimize button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 text-navy-300 rounded-full flex items-center justify-center text-xs transition-colors"
          aria-label="Minimize streak widget"
        >
          −
        </button>
        
        {/* Celebration banner */}
        {showCelebration && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap animate-bounce">
            🎉 {streakData.currentStreak === 1 ? 'Welcome!' : `${streakData.currentStreak} Day Streak!`}
          </div>
        )}
        
        {/* Main streak display */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl animate-fire">
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400">day streak</div>
          </div>
        </div>
        
        {/* Message */}
        <p className="text-sm text-primary-400 font-medium mb-3">
          {getStreakMessage(streakData.currentStreak)}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-navy-800/50 rounded-lg p-2">
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">total visits</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-2">
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">best streak</div>
          </div>
        </div>
        
        {/* Progress to next milestone */}
        {streakData.currentStreak < 30 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Next milestone</span>
              <span>
                {streakData.currentStreak < 3 ? '3 days' : 
                 streakData.currentStreak < 7 ? '7 days' : 
                 streakData.currentStreak < 14 ? '14 days' : '30 days'}
              </span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    streakData.currentStreak < 3 ? (streakData.currentStreak / 3) * 100 :
                    streakData.currentStreak < 7 ? ((streakData.currentStreak - 3) / 4) * 100 :
                    streakData.currentStreak < 14 ? ((streakData.currentStreak - 7) / 7) * 100 :
                    ((streakData.currentStreak - 14) / 16) * 100
                  }%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}