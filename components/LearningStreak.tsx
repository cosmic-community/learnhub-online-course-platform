'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  streak: number
  lastVisit: string
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Keep it up, champion! 🏆",
  "Learning machine! 🤖",
  "Unstoppable! 💪",
  "Knowledge seeker! 🧠",
  "Rising star! ⭐",
  "Future expert! 🎓",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
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
        // Already visited today, just show current streak
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak!
        data = {
          streak: data.streak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 3000)
      } else {
        // Streak broken, start fresh
        data = {
          streak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
      }
    } else {
      // First visit ever!
      data = {
        streak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 3000)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Pick random motivational message
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  if (!streakData) return null

  return (
    <div className={`inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 transition-all duration-500 ${showAnimation ? 'scale-110 shadow-lg shadow-orange-500/20' : ''}`}>
      <div className="flex items-center gap-2">
        <span className={`text-2xl ${showAnimation ? 'animate-bounce' : ''}`}>
          {streakData.streak >= 7 ? '🔥' : streakData.streak >= 3 ? '⚡' : '✨'}
        </span>
        <div className="text-left">
          <div className="text-sm font-bold text-orange-400">
            {streakData.streak} Day Streak!
          </div>
          <div className="text-xs text-orange-300/70">
            {motivationalMessage}
          </div>
        </div>
      </div>
      
      {/* Streak flames animation */}
      {streakData.streak >= 3 && (
        <div className="flex -space-x-1">
          {Array.from({ length: Math.min(streakData.streak, 5) }).map((_, i) => (
            <span 
              key={i} 
              className="animate-pulse text-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              🔥
            </span>
          ))}
        </div>
      )}
    </div>
  )
}