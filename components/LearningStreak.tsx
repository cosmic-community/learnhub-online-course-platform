'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  day: string
  date: number
  active: boolean
  isToday: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Simulate loading streak data from localStorage
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0

    if (lastVisit !== today) {
      // New day visit
      if (lastVisit) {
        const lastDate = new Date(lastVisit)
        const todayDate = new Date(today)
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Consecutive day - increase streak
          currentStreak += 1
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        } else if (diffDays > 1) {
          // Missed days - reset streak
          currentStreak = 1
        }
      } else {
        // First visit
        currentStreak = 1
      }

      localStorage.setItem('learningStreak', currentStreak.toString())
      localStorage.setItem('lastVisitDate', today)
    }

    setStreak(currentStreak)

    // Generate week days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const now = new Date()
    const currentDayOfWeek = now.getDay()
    
    const weekData: StreakDay[] = days.map((day, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - currentDayOfWeek + index)
      
      return {
        day,
        date: date.getDate(),
        active: index <= currentDayOfWeek && currentStreak > (currentDayOfWeek - index),
        isToday: index === currentDayOfWeek
      }
    })

    setWeekDays(weekData)
    
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "Legendary! You're unstoppable!"
    if (streak >= 14) return "Amazing dedication! Keep it up!"
    if (streak >= 7) return "You're on fire! Great progress!"
    if (streak >= 3) return "Building momentum! Nice work!"
    return "Every journey starts with a single step!"
  }

  return (
    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 animate-confetti-1">🎉</div>
          <div className="absolute top-0 left-1/2 animate-confetti-2">⭐</div>
          <div className="absolute top-0 right-1/4 animate-confetti-3">🎊</div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl shadow-lg shadow-primary-500/25">
              {getStreakEmoji()}
            </div>
            {streak >= 7 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 animate-pulse">
                {streak}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{streak}</span>
              <span className="text-navy-400">day streak</span>
            </div>
            <p className="text-sm text-navy-400">{getStreakMessage()}</p>
          </div>
        </div>

        {/* Week Progress */}
        <div className="flex items-center gap-2">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs text-navy-500">{day.day}</span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  day.active
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : day.isToday
                    ? 'bg-navy-700 text-white ring-2 ring-primary-500/50'
                    : 'bg-navy-800 text-navy-500'
                } ${day.isToday ? 'scale-110' : ''}`}
              >
                {day.active ? '✓' : day.date}
              </div>
            </div>
          ))}
        </div>

        {/* Motivation */}
        <div className="text-center md:text-right">
          <p className="text-navy-300 text-sm">
            {streak < 7 ? (
              <>Keep going! <span className="text-primary-400">{7 - streak} days</span> to your first milestone!</>
            ) : streak < 14 ? (
              <>Nice! <span className="text-primary-400">{14 - streak} days</span> to unlock 🔥 status!</>
            ) : streak < 30 ? (
              <>Amazing! <span className="text-primary-400">{30 - streak} days</span> to become legendary!</>
            ) : (
              <>You&apos;re a <span className="text-primary-400">learning legend</span>! 🏆</>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}