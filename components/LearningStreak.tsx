'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  weeklyProgress: boolean[]
  totalMinutes: number
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  weeklyProgress: [false, false, false, false, false, false, false],
  totalMinutes: 0,
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday.toDateString()) {
        // Continue streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          weeklyProgress: updateWeeklyProgress(data.weeklyProgress),
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Show celebration for streak milestones
        if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          weeklyProgress: updateWeeklyProgress([false, false, false, false, false, false, false]),
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        weeklyProgress: updateWeeklyProgress([false, false, false, false, false, false, false]),
        totalMinutes: 0,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
    
    // Animate in
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  function updateWeeklyProgress(current: boolean[]): boolean[] {
    const today = new Date().getDay()
    const newProgress = [...current]
    newProgress[today] = true
    return newProgress
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return "Legendary! You're unstoppable!"
    if (streak >= 14) return "Amazing dedication!"
    if (streak >= 7) return "One week strong! Keep it up!"
    if (streak >= 3) return "Building momentum!"
    return "Great start! Keep learning!"
  }

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="celebration-burst">
            <span className="text-6xl">🎉</span>
          </div>
        </div>
      )}
      
      <div className={`streak-widget ${isVisible ? 'visible' : ''}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="streak-flame">
              <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400">day streak</span>
              </div>
              <p className="text-sm text-primary-400">{getStreakMessage(streakData.currentStreak)}</p>
            </div>
          </div>
          
          {/* Weekly Progress */}
          <div className="flex items-center gap-1">
            {DAYS.map((day, index) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    streakData.weeklyProgress[index]
                      ? 'bg-primary-500 text-white streak-day-complete'
                      : 'bg-navy-800 text-navy-500'
                  }`}
                >
                  {streakData.weeklyProgress[index] ? '✓' : day.charAt(0)}
                </div>
                <span className="text-xs text-navy-500">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Best Streak */}
          <div className="text-center md:text-right">
            <div className="text-sm text-navy-400">Best Streak</div>
            <div className="text-xl font-bold text-white">{streakData.longestStreak} days</div>
          </div>
        </div>
      </div>
    </>
  )
}