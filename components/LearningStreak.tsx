'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, no update needed
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak!
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Show celebration for milestones
        if (data.currentStreak % 7 === 0 || data.currentStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
        
        setJustUpdated(true)
        setTimeout(() => setJustUpdated(false), 2000)
      } else {
        // Streak broken, reset to 1
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = today
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      setJustUpdated(true)
      setTimeout(() => setJustUpdated(false), 2000)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const getStreakMessage = () => {
    const streak = streakData.currentStreak
    if (streak >= 30) return "🏆 Learning Legend!"
    if (streak >= 14) return "⚡ On Fire!"
    if (streak >= 7) return "🌟 Week Warrior!"
    if (streak >= 3) return "🔥 Getting Started!"
    return "👋 Welcome Back!"
  }

  const getStreakColor = () => {
    const streak = streakData.currentStreak
    if (streak >= 30) return 'from-purple-500 to-pink-500'
    if (streak >= 14) return 'from-orange-500 to-red-500'
    if (streak >= 7) return 'from-yellow-500 to-orange-500'
    return 'from-primary-500 to-primary-600'
  }

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
                animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {streakData.currentStreak} Day Streak!
            </div>
          </div>
        </div>
      )}

      {/* Streak Badge - Fixed Position */}
      <div className="fixed top-24 right-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative group flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 border border-navy-700 hover:border-primary-500/50 transition-all duration-300 ${
            justUpdated ? 'streak-glow' : ''
          }`}
        >
          {/* Pulse ring for updates */}
          {justUpdated && (
            <span className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping" />
          )}
          
          {/* Flame icon */}
          <span className={`text-2xl ${streakData.currentStreak > 1 ? 'flame-flicker' : ''}`}>
            🔥
          </span>
          
          {/* Streak count */}
          <span className={`font-bold text-lg bg-gradient-to-r ${getStreakColor()} bg-clip-text text-transparent`}>
            {streakData.currentStreak}
          </span>
          
          {/* Expand indicator */}
          <svg 
            className={`w-4 h-4 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Stats Panel */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-navy-900/95 border border-navy-700 rounded-2xl p-5 shadow-2xl animate-slide-up backdrop-blur-xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔥</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${getStreakColor()} bg-clip-text text-transparent`}>
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-navy-400 text-sm mt-1">
                {getStreakMessage()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            <div className="bg-navy-800/50 rounded-xl p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Next milestone</span>
                <span className="text-primary-400 font-medium">
                  {streakData.currentStreak < 7 ? '7 days' : 
                   streakData.currentStreak < 14 ? '14 days' : 
                   streakData.currentStreak < 30 ? '30 days' : '🏆 Achieved!'}
                </span>
              </div>
              {streakData.currentStreak < 30 && (
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getStreakColor()} rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${Math.min(100, (streakData.currentStreak / (streakData.currentStreak < 7 ? 7 : streakData.currentStreak < 14 ? 14 : 30)) * 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
            
            <p className="text-center text-xs text-navy-500 mt-4">
              Keep learning daily to grow your streak! 📚
            </p>
          </div>
        )}
      </div>
    </>
  )
}