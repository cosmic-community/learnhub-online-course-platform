'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalDaysLearned: number
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Keep the momentum! 💪",
  "Consistency is key! 🗝️",
  "Learning champion! 🏆",
  "Unstoppable! 🚀",
  "You're crushing it! ⚡",
  "Knowledge seeker! 📚",
  "Future expert! 🌟"
]

export default function StreakCounter() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    const updateStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      let data: StreakData
      
      if (stored) {
        data = JSON.parse(stored)
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()
        
        if (lastVisitDate === today) {
          // Already visited today, no changes
          setStreakData(data)
          return
        } else if (lastVisitDate === yesterdayString) {
          // Visited yesterday, increment streak!
          data.currentStreak += 1
          data.totalDaysLearned += 1
          data.lastVisit = today
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
          }
          setShowAnimation(true)
          setTimeout(() => setShowAnimation(false), 2000)
        } else {
          // Streak broken, start new streak
          data.currentStreak = 1
          data.totalDaysLearned += 1
          data.lastVisit = today
        }
      } else {
        // First visit ever
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: 1,
          totalDaysLearned: 1
        }
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 2000)
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
    }
    
    updateStreak()
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  if (!streakData) {
    return null
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '💎'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⭐'
    return '✨'
  }

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-cyan-400 to-blue-500'
    if (streak >= 7) return 'from-orange-400 to-red-500'
    if (streak >= 3) return 'from-green-400 to-emerald-500'
    return 'from-primary-400 to-primary-600'
  }

  return (
    <div 
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-navy-800/80 backdrop-blur-sm border border-navy-700 transition-all duration-500 ${
        showAnimation ? 'scale-110 border-primary-500 shadow-lg shadow-primary-500/25' : ''
      }`}
    >
      <div className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${getStreakColor(streakData.currentStreak)} ${showAnimation ? 'animate-bounce' : ''}`}>
        <span className="text-xl">{getStreakEmoji(streakData.currentStreak)}</span>
        {showAnimation && (
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
        )}
      </div>
      
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} bg-clip-text text-transparent`}>
            {streakData.currentStreak}
          </span>
          <span className="text-navy-300 text-sm font-medium">
            {streakData.currentStreak === 1 ? 'day' : 'day'} streak
          </span>
        </div>
        <p className="text-xs text-navy-500">{motivationalMessage}</p>
      </div>
      
      {streakData.currentStreak >= 7 && (
        <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
          <span className="text-xs">🏆</span>
          <span className="text-xs text-yellow-400 font-medium">Best: {streakData.longestStreak}</span>
        </div>
      )}
    </div>
  )
}