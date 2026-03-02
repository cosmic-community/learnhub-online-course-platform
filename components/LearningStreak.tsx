'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  compact?: boolean
}

export default function LearningStreak({ compact = false }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-learning-visit')
    const today = new Date().toDateString()
    
    if (savedStreak && lastVisit) {
      const lastDate = new Date(lastVisit)
      const dayDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (dayDiff === 0) {
        // Same day visit
        setStreak(parseInt(savedStreak))
        setTodayCompleted(true)
      } else if (dayDiff === 1) {
        // Consecutive day - increment streak
        const newStreak = parseInt(savedStreak) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        localStorage.setItem('last-learning-visit', today)
        setTodayCompleted(true)
        setShowAnimation(true)
      } else {
        // Streak broken - reset
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        localStorage.setItem('last-learning-visit', today)
        setTodayCompleted(true)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-learning-visit', today)
      setTodayCompleted(true)
      setShowAnimation(true)
    }
  }, [])

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary!'
    if (streak >= 14) return 'On fire!'
    if (streak >= 7) return 'Crushing it!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 ${showAnimation ? 'animate-bounce' : ''}`}>
        <span className="text-lg">{getStreakEmoji()}</span>
        <span className="text-sm font-bold text-orange-400">{streak}</span>
        <span className="text-xs text-orange-300/70">day{streak !== 1 ? 's' : ''}</span>
      </div>
    )
  }

  return (
    <div className={`card p-6 text-center relative overflow-hidden ${showAnimation ? 'ring-2 ring-orange-500/50' : ''}`}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10" />
      
      {/* Animated fire particles when streak is active */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s',
              }}
            >
              <span className="text-2xl opacity-60">🔥</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        <div className={`text-5xl mb-2 ${showAnimation ? 'animate-bounce' : ''}`}>
          {getStreakEmoji()}
        </div>
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-1">
          {streak}
        </div>
        <div className="text-sm text-navy-300 mb-2">
          day learning streak
        </div>
        <div className="text-xs font-medium text-orange-400">
          {getStreakMessage()}
        </div>
        
        {todayCompleted && (
          <div className="mt-4 flex items-center justify-center gap-1 text-green-400 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Today's visit logged
          </div>
        )}
      </div>
    </div>
  )
}