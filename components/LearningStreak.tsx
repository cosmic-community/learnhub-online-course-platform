'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const STORAGE_KEY = 'learnhub-streak'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid data, return default
    }
  }
  return { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
}

function updateStreakData(data: StreakData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const data = getStreakData()
    const today = getDateString(new Date())
    
    if (data.lastVisit === today) {
      // Already visited today
      setStreak(data)
      return
    }
    
    let newStreak = data.currentStreak
    let newLongest = data.longestStreak
    const newTotalVisits = data.totalVisits + 1
    
    if (data.lastVisit === '') {
      // First visit ever
      newStreak = 1
    } else {
      const daysDiff = getDaysDifference(data.lastVisit, today)
      if (daysDiff === 1) {
        // Consecutive day - increase streak!
        newStreak = data.currentStreak + 1
        setIsAnimating(true)
        if (newStreak > 1 && newStreak % 5 === 0) {
          setShowConfetti(true)
        }
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        newStreak = 1
      }
    }
    
    if (newStreak > newLongest) {
      newLongest = newStreak
    }
    
    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastVisit: today,
      totalVisits: newTotalVisits,
    }
    
    updateStreakData(newData)
    setStreak(newData)
    
    // Reset animation after delay
    setTimeout(() => setIsAnimating(false), 1000)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '⭐'
    if (count >= 7) return '🔥'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (count: number): string => {
    if (count >= 30) return 'Legendary learner! You\'re unstoppable!'
    if (count >= 14) return 'Two weeks strong! Amazing dedication!'
    if (count >= 7) return 'A full week! You\'re on fire!'
    if (count >= 3) return 'Great momentum! Keep it going!'
    if (count === 1) return 'Welcome back! Let\'s learn something new!'
    return 'Start your learning streak today!'
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][i % 5],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">{getStreakEmoji(streak.currentStreak)}</span>
          Learning Streak
        </h3>
        <div className="text-xs text-navy-400 bg-navy-800 px-3 py-1 rounded-full">
          {streak.totalVisits} total visits
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div 
            className={`text-5xl font-bold text-primary-400 transition-all duration-500 ${
              isAnimating ? 'scale-125 text-green-400' : ''
            }`}
          >
            {streak.currentStreak}
          </div>
          <div className="text-sm text-navy-400 mt-1">day{streak.currentStreak !== 1 ? 's' : ''}</div>
        </div>
        
        <div className="flex-1">
          <p className="text-navy-200 mb-3">{getMotivationalMessage(streak.currentStreak)}</p>
          
          {/* Streak progress bar */}
          <div className="relative h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((streak.currentStreak / 7) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-navy-500 mt-1">
            <span>Start</span>
            <span>7-day goal</span>
          </div>
        </div>
      </div>
      
      {streak.longestStreak > 1 && (
        <div className="mt-4 pt-4 border-t border-navy-800 flex items-center justify-between text-sm">
          <span className="text-navy-400">🏅 Personal best:</span>
          <span className="text-white font-medium">{streak.longestStreak} days</span>
        </div>
      )}
    </div>
  )
}