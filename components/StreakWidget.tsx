'use client'

import { useState, useEffect } from 'react'

export default function StreakWidget() {
  const [streak, setStreak] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const streakKey = 'learnhub-streak'
    const lastVisitKey = 'learnhub-last-visit'
    
    const savedStreak = localStorage.getItem(streakKey)
    const savedLastVisit = localStorage.getItem(lastVisitKey)
    const today = new Date().toDateString()
    
    if (savedStreak && savedLastVisit) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (savedLastVisit === today) {
        setStreak(parseInt(savedStreak, 10))
      } else if (savedLastVisit === yesterday) {
        const newStreak = parseInt(savedStreak, 10) + 1
        setStreak(newStreak)
        localStorage.setItem(streakKey, String(newStreak))
        localStorage.setItem(lastVisitKey, today)
      } else {
        setStreak(1)
        localStorage.setItem(streakKey, '1')
        localStorage.setItem(lastVisitKey, today)
      }
    } else {
      setStreak(1)
      localStorage.setItem(streakKey, '1')
      localStorage.setItem(lastVisitKey, today)
    }
    
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/50 animate-pulse">
        <span className="w-16 h-5 bg-navy-700 rounded" />
      </div>
    )
  }

  const getStreakEmoji = () => {
    if (streak >= 30) return '💎'
    if (streak >= 14) return '🌟'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '🔥'
    return '✨'
  }

  const getStreakColor = () => {
    if (streak >= 30) return 'from-purple-500 to-pink-500'
    if (streak >= 14) return 'from-yellow-500 to-orange-500'
    if (streak >= 7) return 'from-orange-500 to-red-500'
    if (streak >= 3) return 'from-primary-500 to-primary-400'
    return 'from-navy-600 to-navy-500'
  }

  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-gradient-to-r ${getStreakColor()} 
        text-white font-medium text-sm
        shadow-lg shadow-primary-500/20
        transition-all duration-300 hover:scale-105
      `}
      title={`${streak} day learning streak!`}
    >
      <span className="text-base animate-bounce-slow">{getStreakEmoji()}</span>
      <span>{streak}</span>
    </div>
  )
}