'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Same day visit
        setStreak(data)
      } else if (lastVisitDate === yesterdayString) {
        // Consecutive day - streak continues!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
        setShowAnimation(true)
      } else {
        // Streak broken
        const newStreak: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowAnimation(true)
    }
  }, [])

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  if (!streak) return null

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '💎'
    if (count >= 7) return '🔥'
    if (count >= 3) return '⚡'
    return '✨'
  }

  const getStreakMessage = (count: number): string => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'Two weeks strong!'
    if (count >= 7) return 'On fire!'
    if (count >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getStreakEmoji(streak.currentStreak)}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{streak.currentStreak}</span>
              <span className="text-orange-400 font-medium">day streak</span>
            </div>
            <p className="text-sm text-orange-300/80">{getStreakMessage(streak.currentStreak)}</p>
          </div>
        </div>
        
        {streak.longestStreak > streak.currentStreak && (
          <div className="mt-2 pt-2 border-t border-orange-500/20">
            <p className="text-xs text-navy-400">
              Best streak: <span className="text-orange-400">{streak.longestStreak} days</span>
            </p>
          </div>
        )}

        {isNewDay && showAnimation && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            +1 day!
          </div>
        )}
      </div>
    </div>
  )
}