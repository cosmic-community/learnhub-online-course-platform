'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  day: string
  completed: boolean
  isToday: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Simulate streak data - in a real app, this would come from user data
  const weekDays: StreakDay[] = [
    { day: 'M', completed: true, isToday: false },
    { day: 'T', completed: true, isToday: false },
    { day: 'W', completed: true, isToday: false },
    { day: 'T', completed: true, isToday: false },
    { day: 'F', completed: true, isToday: false },
    { day: 'S', completed: false, isToday: false },
    { day: 'S', completed: false, isToday: true },
  ]

  useEffect(() => {
    // Animate streak counter
    setIsVisible(true)
    const completedDays = weekDays.filter(d => d.completed).length
    
    let current = 0
    const interval = setInterval(() => {
      if (current < completedDays) {
        current++
        setStreak(current)
      } else {
        clearInterval(interval)
        if (completedDays >= 5) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 2000)
        }
      }
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/20 via-navy-900/50 to-navy-900/80 
        border border-primary-500/30 p-6 transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#14b8a6', '#fbbf24', '#f472b6', '#60a5fa'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-3xl">🔥</span>
            {streak >= 5 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] animate-bounce">
                ⭐
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Learning Streak</h3>
            <p className="text-navy-400 text-sm">Keep the momentum going!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary-400 tabular-nums">{streak}</div>
          <div className="text-navy-400 text-sm">day streak</div>
        </div>
      </div>

      {/* Week progress */}
      <div className="flex justify-between gap-2 mt-4">
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300 delay-${index * 100}
                ${day.completed 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                  : day.isToday 
                    ? 'bg-navy-700 text-white border-2 border-dashed border-primary-400 animate-pulse' 
                    : 'bg-navy-800 text-navy-500'
                }
              `}
            >
              {day.completed ? '✓' : day.isToday ? '?' : '○'}
            </div>
            <span className={`text-xs ${day.isToday ? 'text-primary-400 font-medium' : 'text-navy-500'}`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational message */}
      <div className="mt-4 pt-4 border-t border-navy-700/50">
        <p className="text-sm text-navy-300 text-center">
          {streak >= 7 
            ? "🎉 Amazing! You're on fire this week!" 
            : streak >= 5 
              ? "🌟 Great job! Keep up the momentum!" 
              : streak >= 3 
                ? "💪 Nice streak! You're building a habit!" 
                : "🚀 Start learning today to begin your streak!"}
        </p>
      </div>
    </div>
  )
}