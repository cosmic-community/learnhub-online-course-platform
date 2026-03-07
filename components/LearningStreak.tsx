'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  count: number
  lastVisit: string
}

const MILESTONES = [7, 30, 100, 365]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastVisit: '' })
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [celebrationMilestone, setCelebrationMilestone] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, keep streak
        setStreak(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = { count: data.count + 1, lastVisit: today }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
        
        // Check for milestone celebration
        if (MILESTONES.includes(newStreak.count)) {
          setCelebrationMilestone(newStreak.count)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, reset to 1
        const newStreak = { count: 1, lastVisit: today }
        setStreak(newStreak)
        localStorage.setItem('learning-streak', JSON.stringify(newStreak))
      }
    } else {
      // First visit ever
      const newStreak = { count: 1, lastVisit: today }
      setStreak(newStreak)
      localStorage.setItem('learning-streak', JSON.stringify(newStreak))
    }
    
    setIsLoaded(true)
  }, [])

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800/50 rounded-full">
        <span className="text-sm">🔥</span>
        <span className="text-sm font-medium text-navy-400">-</span>
      </div>
    )
  }

  const getFireSize = () => {
    if (streak.count >= 100) return 'text-2xl'
    if (streak.count >= 30) return 'text-xl'
    if (streak.count >= 7) return 'text-lg'
    return 'text-sm'
  }

  const getGlowIntensity = () => {
    if (streak.count >= 100) return 'shadow-lg shadow-orange-500/50'
    if (streak.count >= 30) return 'shadow-md shadow-orange-500/40'
    if (streak.count >= 7) return 'shadow-sm shadow-orange-500/30'
    return ''
  }

  const getMilestoneMessage = () => {
    if (celebrationMilestone === 7) return '🎉 1 Week Streak!'
    if (celebrationMilestone === 30) return '🏆 1 Month Streak!'
    if (celebrationMilestone === 100) return '⭐ 100 Days! Legend!'
    if (celebrationMilestone === 365) return '👑 1 Year! Incredible!'
    return ''
  }

  return (
    <div className="relative">
      {/* Celebration Popup */}
      {showCelebration && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 animate-bounce">
          <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-lg">
            {getMilestoneMessage()}
          </div>
        </div>
      )}
      
      {/* Streak Badge */}
      <div 
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-700/50 rounded-full transition-all duration-300 cursor-default ${getGlowIntensity()}`}
        title={`${streak.count} day learning streak! Keep it up!`}
      >
        <span 
          className={`${getFireSize()} transition-all duration-300 ${streak.count >= 7 ? 'animate-pulse' : ''}`}
          style={{ 
            filter: streak.count >= 30 ? 'drop-shadow(0 0 8px #f97316)' : 'none'
          }}
        >
          🔥
        </span>
        <span className={`text-sm font-semibold ${streak.count >= 7 ? 'text-orange-400' : 'text-navy-200'}`}>
          {streak.count}
        </span>
      </div>
    </div>
  )
}