'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { days: 1, emoji: '🌱', label: 'First Step' },
  { days: 3, emoji: '🔥', label: 'Getting Warm' },
  { days: 7, emoji: '⭐', label: 'Week Warrior' },
  { days: 14, emoji: '💪', label: 'Dedicated' },
  { days: 30, emoji: '🏆', label: 'Champion' },
  { days: 60, emoji: '👑', label: 'Legend' },
  { days: 100, emoji: '🚀', label: 'Unstoppable' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAchievement, setShowAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored 
      ? JSON.parse(stored) 
      : { currentStreak: 0, lastVisit: '', totalDays: 0, achievements: [] }

    const lastVisitDate = new Date(data.lastVisit).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate === today) {
      // Already visited today
      setStreakData(data)
    } else if (lastVisitDate === yesterday) {
      // Visited yesterday - increment streak
      data.currentStreak += 1
      data.totalDays += 1
      data.lastVisit = new Date().toISOString()
      
      // Check for new achievement
      const newAchievement = ACHIEVEMENTS.find(
        a => a.days === data.currentStreak && !data.achievements.includes(a.label)
      )
      if (newAchievement) {
        data.achievements.push(newAchievement.label)
        setShowAchievement(newAchievement)
        setTimeout(() => setShowAchievement(null), 4000)
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    } else if (data.lastVisit === '') {
      // First visit ever
      data.currentStreak = 1
      data.totalDays = 1
      data.lastVisit = new Date().toISOString()
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    } else {
      // Streak broken - start fresh
      data.currentStreak = 1
      data.totalDays += 1
      data.lastVisit = new Date().toISOString()
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
    }
  }, [])

  if (!streakData) {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold text-white">-</div>
        <div className="text-navy-400 text-sm">Day Streak</div>
      </div>
    )
  }

  const currentAchievement = [...ACHIEVEMENTS].reverse().find(a => streakData.currentStreak >= a.days)

  return (
    <>
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="achievement-popup bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-6 rounded-2xl shadow-2xl shadow-primary-500/50">
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">{showAchievement.emoji}</div>
              <div className="text-xl font-bold">Achievement Unlocked!</div>
              <div className="text-primary-100">{showAchievement.label}</div>
              <div className="text-sm text-primary-200 mt-2">{showAchievement.days} day streak!</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Display */}
      <div className="text-center relative group cursor-pointer">
        <div className={`text-3xl font-bold text-white flex items-center justify-center gap-1 ${isAnimating ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}>
          <span className={`${streakData.currentStreak >= 3 ? 'fire-animation' : ''}`}>
            {currentAchievement?.emoji || '🌱'}
          </span>
          <span>{streakData.currentStreak}</span>
        </div>
        <div className="text-navy-400 text-sm">Day Streak</div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-sm whitespace-nowrap shadow-xl">
            <div className="text-white font-medium mb-1">Your Learning Journey</div>
            <div className="text-navy-300">Total days: {streakData.totalDays}</div>
            <div className="text-navy-300">Achievements: {streakData.achievements.length}/{ACHIEVEMENTS.length}</div>
            {streakData.currentStreak < 100 && (
              <div className="text-primary-400 mt-1">
                {ACHIEVEMENTS.find(a => a.days > streakData.currentStreak)?.days ?? 100 - streakData.currentStreak} days to next badge!
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-navy-800"></div>
        </div>
      </div>
    </>
  )
}