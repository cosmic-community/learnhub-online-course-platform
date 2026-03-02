'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  date: string
  completed: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const savedDays = localStorage.getItem('learning-days')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (savedStreak) {
      const streakNum = parseInt(savedStreak, 10)
      setStreak(streakNum)
      
      // Check if this is a milestone
      if (streakNum > 0 && streakNum % 7 === 0) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }

    if (savedDays) {
      setWeekDays(JSON.parse(savedDays))
    } else {
      initializeWeek()
    }

    // Update streak on new day visit
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increment streak
        const newStreak = (parseInt(savedStreak || '0', 10)) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
        
        // Celebration for milestones
        if (newStreak % 7 === 0) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else if (lastVisit && lastVisit !== today) {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      } else if (!lastVisit) {
        // First visit ever
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      }
      
      localStorage.setItem('last-visit-date', today)
      updateWeekDays(today)
    }
  }, [])

  const initializeWeek = () => {
    const days: StreakDay[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toDateString(),
        completed: false
      })
    }
    setWeekDays(days)
    localStorage.setItem('learning-days', JSON.stringify(days))
  }

  const updateWeekDays = (today: string) => {
    setWeekDays(prev => {
      const newDays = prev.map(day => ({
        ...day,
        completed: day.date === today ? true : day.completed
      }))
      
      // Shift days if we're past the week
      const todayObj = new Date(today)
      const firstDay = new Date(prev[0]?.date || today)
      const daysDiff = Math.floor((todayObj.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff >= 7) {
        // Reset week
        const freshDays: StreakDay[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          freshDays.push({
            date: date.toDateString(),
            completed: date.toDateString() === today
          })
        }
        localStorage.setItem('learning-days', JSON.stringify(freshDays))
        return freshDays
      }
      
      localStorage.setItem('learning-days', JSON.stringify(newDays))
      return newDays
    })
  }

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getStreakMessage = () => {
    if (streak === 0) return "Start your learning journey!"
    if (streak === 1) return "Great start! Day 1 🎯"
    if (streak < 7) return `${streak} day streak! Keep going! 🔥`
    if (streak < 30) return `${streak} days! You're on fire! 🔥🔥`
    if (streak < 100) return `${streak} days! Learning machine! 🚀`
    return `${streak} days! Legendary! 👑`
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-1/4 animate-confetti-1">🎉</div>
          <div className="absolute top-0 left-1/2 animate-confetti-2">⭐</div>
          <div className="absolute top-0 left-3/4 animate-confetti-3">🎊</div>
          <div className="absolute top-0 left-1/3 animate-confetti-4">✨</div>
          <div className="absolute top-0 left-2/3 animate-confetti-5">🌟</div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>🔥</span>
            Learning Streak
          </h3>
          <p className="text-navy-400 text-sm mt-1">{getStreakMessage()}</p>
        </div>
        <div className={`text-4xl font-bold text-primary-400 ${isAnimating ? 'animate-pulse scale-125' : ''} transition-transform`}>
          {streak}
        </div>
      </div>

      {/* Week Progress */}
      <div className="flex justify-between gap-2">
        {weekDays.map((day, index) => (
          <div key={day.date} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                day.completed 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' 
                  : 'bg-navy-800 text-navy-500'
              } ${index === weekDays.length - 1 && day.completed ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' : ''}`}
            >
              {day.completed ? '✓' : '○'}
            </div>
            <span className={`text-xs mt-2 ${day.completed ? 'text-primary-400 font-medium' : 'text-navy-500'}`}>
              {getDayName(day.date)}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-navy-400 mb-2">
          <span>Week Progress</span>
          <span>{weekDays.filter(d => d.completed).length}/7 days</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
            style={{ width: `${(weekDays.filter(d => d.completed).length / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Milestone Indicator */}
      {streak > 0 && (
        <div className="mt-4 pt-4 border-t border-navy-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-navy-400">Next milestone</span>
            <span className="text-primary-400 font-medium">
              {7 - (streak % 7)} days to {Math.ceil((streak + 1) / 7) * 7}-day badge! 🏆
            </span>
          </div>
        </div>
      )}
    </div>
  )
}