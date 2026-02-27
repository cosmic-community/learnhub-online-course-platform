'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  weeklyProgress: boolean[]
}

const STORAGE_KEY = 'learnhub_streak'

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalDays: 0,
      weeklyProgress: [false, false, false, false, false, false, false]
    }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDays: 0,
    weeklyProgress: [false, false, false, false, false, false, false]
  }
}

function updateStreak(prev: StreakData): StreakData {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  if (prev.lastVisit === today) {
    return prev
  }
  
  let newStreak = prev.currentStreak
  let newTotal = prev.totalDays
  
  if (prev.lastVisit === yesterday) {
    newStreak += 1
    newTotal += 1
  } else if (prev.lastVisit === '') {
    newStreak = 1
    newTotal = 1
  } else {
    newStreak = 1
    newTotal += 1
  }
  
  const dayOfWeek = new Date().getDay()
  const weeklyProgress = [...prev.weeklyProgress]
  weeklyProgress[dayOfWeek] = true
  
  // Reset weekly progress on Sunday if it's a new week
  if (dayOfWeek === 0 && prev.lastVisit !== today) {
    weeklyProgress.fill(false)
    weeklyProgress[0] = true
  }
  
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(prev.longestStreak, newStreak),
    lastVisit: today,
    totalDays: newTotal,
    weeklyProgress
  }
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  
  useEffect(() => {
    const stored = getStoredStreak()
    const updated = updateStreak(stored)
    
    if (updated.currentStreak > stored.currentStreak) {
      setIsNewStreak(true)
      if (updated.currentStreak % 7 === 0) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
    
    setStreak(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [])
  
  if (!streak) {
    return null
  }
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const todayIndex = new Date().getDay()
  
  return (
    <div className="relative">
      {/* Celebration confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="card p-6 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`text-4xl ${streak.currentStreak > 0 ? 'streak-fire' : ''}`}>
                🔥
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Learning Streak</h3>
                <p className="text-navy-400 text-sm">Keep learning every day!</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold text-white ${isNewStreak ? 'counter-animate' : ''}`}>
                {streak.currentStreak}
              </div>
              <div className="text-navy-400 text-sm">
                {streak.currentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
          
          {/* Weekly progress */}
          <div className="mb-4">
            <div className="flex justify-between gap-1">
              {dayNames.map((day, index) => (
                <div key={day} className="flex-1 text-center">
                  <div className="text-xs text-navy-500 mb-1">{day}</div>
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
                      streak.weeklyProgress[index]
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : index === todayIndex
                        ? 'bg-navy-700 text-navy-400 animate-pulse-glow border-2 border-primary-500/50'
                        : 'bg-navy-800 text-navy-600'
                    }`}
                  >
                    {streak.weeklyProgress[index] ? '✓' : index === todayIndex ? '!' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats row */}
          <div className="flex justify-between text-sm border-t border-navy-800 pt-4">
            <div className="text-center">
              <div className="text-white font-semibold">{streak.longestStreak}</div>
              <div className="text-navy-500 text-xs">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">{streak.totalDays}</div>
              <div className="text-navy-500 text-xs">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">
                {streak.weeklyProgress.filter(Boolean).length}/7
              </div>
              <div className="text-navy-500 text-xs">This Week</div>
            </div>
          </div>
          
          {/* Motivational message */}
          {streak.currentStreak >= 7 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 rounded-lg border border-primary-500/30">
              <div className="flex items-center gap-2">
                <span className="text-xl sparkle">⭐</span>
                <span className="text-sm text-white">
                  {streak.currentStreak >= 30
                    ? "Legendary! 30+ day streak! 🏆"
                    : streak.currentStreak >= 14
                    ? "Amazing! 2 weeks strong! 💪"
                    : "Great work! One week streak! 🎉"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}