'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalDays: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    totalDays: 0,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreak = () => {
      const stored = localStorage.getItem('learning-streak')
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const today = new Date().toDateString()
        const lastDate = data.lastLearningDate
        
        if (lastDate) {
          const daysDiff = getDaysDifference(new Date(lastDate), new Date())
          
          if (daysDiff > 1) {
            // Streak broken
            data.currentStreak = 0
          }
        }
        
        setStreakData(data)
      }
    }
    
    loadStreak()
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getDaysDifference = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.floor(Math.abs((date2.getTime() - date1.getTime()) / oneDay))
  }

  const recordLearning = () => {
    const today = new Date().toDateString()
    const lastDate = streakData.lastLearningDate
    
    let newStreak = streakData.currentStreak
    
    if (lastDate !== today) {
      if (lastDate) {
        const daysDiff = getDaysDifference(new Date(lastDate), new Date())
        if (daysDiff === 1) {
          newStreak += 1
        } else if (daysDiff > 1) {
          newStreak = 1
        }
      } else {
        newStreak = 1
      }
      
      const newData: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streakData.longestStreak),
        lastLearningDate: today,
        totalDays: streakData.totalDays + 1,
      }
      
      setStreakData(newData)
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      
      // Show celebration for milestones
      if (newStreak === 7 || newStreak === 30 || newStreak === 100 || newStreak % 50 === 0) {
        setShowFireworks(true)
        setTimeout(() => setShowFireworks(false), 3000)
      }
    }
  }

  // Expose recordLearning to window for other components to call
  useEffect(() => {
    (window as typeof window & { recordLearning?: () => void }).recordLearning = recordLearning
  }, [streakData])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '👑'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '🌟'
    if (streak >= 7) return '✨'
    return '🔥'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 100) return 'Legendary!'
    if (streak >= 50) return 'Incredible!'
    if (streak >= 30) return 'Amazing!'
    if (streak >= 14) return 'On Fire!'
    if (streak >= 7) return 'Great week!'
    if (streak >= 3) return 'Keep it up!'
    if (streak >= 1) return 'Nice start!'
    return 'Start learning!'
  }

  if (!isVisible) return null

  return (
    <>
      <div 
        className={`card p-4 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Fire Icon with Animation */}
          <div className="relative">
            <span 
              className={`text-4xl ${streakData.currentStreak > 0 ? 'flame-animate' : 'opacity-50'}`}
            >
              {getStreakEmoji(streakData.currentStreak)}
            </span>
            {streakData.currentStreak >= 7 && (
              <div className="absolute -top-1 -right-1">
                <span className="sparkle text-yellow-400 text-sm">✦</span>
              </div>
            )}
          </div>

          {/* Streak Info */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold text-white count-animate`}>
                {streakData.currentStreak}
              </span>
              <span className="text-navy-400 text-sm">day streak</span>
            </div>
            <p className="text-sm text-primary-400 font-medium">
              {getStreakMessage(streakData.currentStreak)}
            </p>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="text-xs text-navy-500">Best: {streakData.longestStreak} days</div>
            <div className="text-xs text-navy-500">Total: {streakData.totalDays} days</div>
          </div>
        </div>

        {/* Streak Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-navy-500 mb-1">
            <span>Weekly Goal</span>
            <span>{Math.min(streakData.currentStreak, 7)}/7 days</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((streakData.currentStreak / 7) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confetti celebration */}
      {showFireworks && <Confetti />}
    </>
  )
}

// Confetti component
function Confetti() {
  const colors = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}