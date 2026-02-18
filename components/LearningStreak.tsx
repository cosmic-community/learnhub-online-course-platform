'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  date: string
  active: boolean
  isToday: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    // Get streak data from localStorage
    const storedStreak = localStorage.getItem('learningStreak')
    const storedLongest = localStorage.getItem('longestStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    let currentStreak = storedStreak ? parseInt(storedStreak) : 0
    let longest = storedLongest ? parseInt(storedLongest) : 0

    // Check if this is a new day visit
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increment streak
        currentStreak += 1
      } else if (lastVisit !== today) {
        // Streak broken - reset to 1
        currentStreak = 1
      }

      localStorage.setItem('learningStreak', currentStreak.toString())
      localStorage.setItem('lastVisitDate', today)

      // Update longest streak
      if (currentStreak > longest) {
        longest = currentStreak
        localStorage.setItem('longestStreak', longest.toString())
      }

      // Show celebration for milestone streaks
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }

    setStreak(currentStreak)
    setLongestStreak(longest)

    // Generate week days
    const days: StreakDay[] = []
    const todayDate = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(todayDate.getDate() - i)
      const dateStr = date.toDateString()
      
      // Check if this day was active (simplified - in real app, track actual activity)
      const visitDates = JSON.parse(localStorage.getItem('visitDates') || '[]')
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        active: visitDates.includes(dateStr) || (i === 0),
        isToday: i === 0
      })
    }

    // Store today's visit
    const visitDates = JSON.parse(localStorage.getItem('visitDates') || '[]')
    if (!visitDates.includes(today)) {
      visitDates.push(today)
      // Keep only last 30 days
      if (visitDates.length > 30) {
        visitDates.shift()
      }
      localStorage.setItem('visitDates', JSON.stringify(visitDates))
    }

    setWeekDays(days)
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "You're on fire!"
    if (streak >= 7) return "One week strong!"
    if (streak >= 3) return "Great momentum!"
    if (streak >= 1) return "Keep it going!"
    return "Start your streak!"
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Learning Streak {getStreakEmoji()}
          </h3>
          <p className="text-navy-400 text-sm">{getStreakMessage()}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary-400">{streak}</div>
          <div className="text-navy-400 text-xs">day{streak !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Week Progress */}
      <div className="flex justify-between gap-2 mb-6">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                day.active
                  ? day.isToday
                    ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900'
                    : 'bg-primary-500/30 text-primary-400'
                  : 'bg-navy-800 text-navy-500'
              }`}
            >
              {day.active ? '✓' : '○'}
            </div>
            <span className={`text-xs ${day.isToday ? 'text-primary-400 font-semibold' : 'text-navy-500'}`}>
              {day.date}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{longestStreak}</div>
          <div className="text-navy-400 text-xs">Longest Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {streak >= 7 ? Math.floor(streak / 7) : 0}
          </div>
          <div className="text-navy-400 text-xs">Weeks Complete</div>
        </div>
      </div>

      {/* Progress to next milestone */}
      {streak > 0 && (
        <div className="mt-4 pt-4 border-t border-navy-800">
          <div className="flex justify-between text-xs text-navy-400 mb-2">
            <span>Progress to {streak < 7 ? '7-day' : streak < 14 ? '14-day' : streak < 30 ? '30-day' : '60-day'} milestone</span>
            <span>
              {streak < 7 ? `${streak}/7` : streak < 14 ? `${streak}/14` : streak < 30 ? `${streak}/30` : `${streak}/60`}
            </span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{
                width: `${streak < 7 ? (streak / 7) * 100 : streak < 14 ? (streak / 14) * 100 : streak < 30 ? (streak / 30) * 100 : (streak / 60) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}