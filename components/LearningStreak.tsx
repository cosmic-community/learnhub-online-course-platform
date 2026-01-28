'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  lessonsCompleted: number
}

const motivationalMessages = [
  "🔥 You're on fire! Keep learning!",
  "⭐ Great progress! You're a star!",
  "🚀 Launching towards your goals!",
  "💪 Strong work! Don't stop now!",
  "🎯 Focused and determined!",
  "✨ Brilliant! Keep shining!",
  "🏆 Champion learner!",
  "📚 Knowledge seeker!",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
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
          // Visited yesterday - increment streak
          const newData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastVisit: today,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
        } else {
          // Streak broken - reset
          const newData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastVisit: today,
            lessonsCompleted: data.lessonsCompleted,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
        }
      } else {
        // First visit
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          lessonsCompleted: 0,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    }

    loadStreakData()
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
    
    // Show the streak counter after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!streakData) return null

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg shadow-orange-500/25 text-white min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="text-4xl animate-pulse">🔥</div>
          <div>
            <div className="text-2xl font-bold">{streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}</div>
            <div className="text-orange-100 text-sm">Learning Streak</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-orange-400/30 text-sm">
          <div className="flex justify-between text-orange-100">
            <span>Longest streak:</span>
            <span className="font-semibold text-white">{streakData.longestStreak} days</span>
          </div>
          <div className="flex justify-between text-orange-100 mt-1">
            <span>Lessons viewed:</span>
            <span className="font-semibold text-white">{streakData.lessonsCompleted}</span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-orange-100 italic text-center">
          {message}
        </div>
      </div>
    </div>
  )
}