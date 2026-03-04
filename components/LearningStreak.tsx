'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()
        
        if (lastVisitDate === today) {
          // Already visited today
          setStreakData(data)
        } else if (lastVisitDate === yesterdayString) {
          // Visited yesterday - streak continues!
          const newData: StreakData = {
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastVisit: new Date().toISOString(),
            totalVisits: data.totalVisits + 1,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        } else {
          // Streak broken - start fresh
          const newData: StreakData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastVisit: new Date().toISOString(),
            totalVisits: data.totalVisits + 1,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
        }
      } else {
        // First visit ever!
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: new Date().toISOString(),
          totalVisits: 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      setIsLoaded(true)
    }
    
    loadStreak()
  }, [])

  if (!isLoaded || !streakData) {
    return null
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '💎'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '✨'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 30) return "Legendary learner! You're unstoppable!"
    if (streak >= 14) return "Two weeks strong! Diamond status!"
    if (streak >= 7) return "One week streak! You're on fire!"
    if (streak >= 3) return "Building momentum! Keep it up!"
    if (streak === 1) return "Welcome back! Start your journey!"
    return "Great start! Come back tomorrow!"
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
      
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-navy-800/50 border border-primary-500/30 backdrop-blur-sm transition-all duration-500 ${showCelebration ? 'scale-110 border-primary-400' : ''}`}>
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${showCelebration ? 'animate-pulse' : ''}`}>
            {getStreakEmoji(streakData.currentStreak)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">
              {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak
            </span>
            <span className="text-xs text-navy-400">
              {getMotivationalMessage(streakData.currentStreak)}
            </span>
          </div>
        </div>
        
        {streakData.longestStreak > 1 && (
          <div className="pl-3 border-l border-navy-600">
            <div className="text-xs text-navy-400">Best</div>
            <div className="text-sm font-semibold text-primary-400">
              {streakData.longestStreak} days
            </div>
          </div>
        )}
      </div>
    </div>
  )
}