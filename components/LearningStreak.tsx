'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  date: string
  completed: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastLearningVisit')
    const today = new Date().toDateString()
    
    if (savedStreak) {
      const streakData = JSON.parse(savedStreak)
      
      // Check if streak continues from yesterday or today
      if (lastVisit === today) {
        setStreak(streakData.count)
        setTodayCompleted(true)
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastVisit === yesterday.toDateString()) {
          setStreak(streakData.count)
        } else {
          // Streak broken, but don't reset until they mark today
          setStreak(streakData.count)
        }
      }
    }
    
    // Generate week days
    const days: StreakDay[] = []
    const savedDays = localStorage.getItem('learningDays')
    const completedDays = savedDays ? JSON.parse(savedDays) : []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      days.push({
        date: dateStr,
        completed: completedDays.includes(dateStr)
      })
    }
    setWeekDays(days)
  }, [])

  const markTodayComplete = () => {
    if (todayCompleted) return
    
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('lastLearningVisit')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    let newStreak = 1
    
    if (lastVisit === yesterday.toDateString()) {
      // Continue streak
      const savedStreak = localStorage.getItem('learningStreak')
      if (savedStreak) {
        newStreak = JSON.parse(savedStreak).count + 1
      }
    }
    
    // Save streak
    localStorage.setItem('learningStreak', JSON.stringify({ count: newStreak }))
    localStorage.setItem('lastLearningVisit', today)
    
    // Save completed days
    const savedDays = localStorage.getItem('learningDays')
    const completedDays = savedDays ? JSON.parse(savedDays) : []
    if (!completedDays.includes(today)) {
      completedDays.push(today)
      // Keep only last 30 days
      while (completedDays.length > 30) {
        completedDays.shift()
      }
      localStorage.setItem('learningDays', JSON.stringify(completedDays))
    }
    
    setStreak(newStreak)
    setTodayCompleted(true)
    setShowCelebration(true)
    
    // Update weekDays
    setWeekDays(prev => prev.map(day => 
      day.date === today ? { ...day, completed: true } : day
    ))
    
    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 2000)
  }

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="celebration-particles">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="celebration-particle" style={{ '--i': i } as React.CSSProperties}>
                {['🎉', '⭐', '🔥', '💪', '✨'][i % 5]}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Learning Streak
          </h3>
          <p className="text-navy-400 text-sm">Keep learning every day!</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary-400">{streak}</div>
          <div className="text-navy-400 text-sm">{streak === 1 ? 'day' : 'days'}</div>
        </div>
      </div>
      
      {/* Week tracker */}
      <div className="flex justify-between gap-2 mb-6">
        {weekDays.map((day, index) => {
          const dayDate = new Date(day.date)
          const isToday = day.date === new Date().toDateString()
          
          return (
            <div key={day.date} className="flex-1 text-center">
              <div className="text-xs text-navy-500 mb-2">{dayNames[dayDate.getDay()]}</div>
              <div 
                className={`
                  w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${day.completed 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : isToday 
                      ? 'bg-navy-700 text-navy-300 ring-2 ring-primary-500/50' 
                      : 'bg-navy-800 text-navy-500'
                  }
                `}
              >
                {day.completed ? '✓' : dayDate.getDate()}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Mark today button */}
      <button
        onClick={markTodayComplete}
        disabled={todayCompleted}
        className={`
          w-full py-3 rounded-lg font-medium transition-all duration-300
          ${todayCompleted 
            ? 'bg-green-500/20 text-green-400 cursor-default' 
            : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]'
          }
        `}
      >
        {todayCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Today&apos;s learning complete!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>✨</span>
            Mark Today as Complete
          </span>
        )}
      </button>
      
      {/* Motivational message */}
      {streak >= 7 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-300 text-sm text-center">
            🏆 Amazing! You&apos;re on a {streak}-day streak! Keep it up!
          </p>
        </div>
      )}
    </div>
  )
}