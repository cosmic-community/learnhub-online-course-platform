'use client'

import { useState, useEffect } from 'react'

interface StreakDay {
  day: string
  completed: boolean
  isToday: boolean
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [weekDays, setWeekDays] = useState<StreakDay[]>([])

  useEffect(() => {
    // Simulate fetching streak data - in production, this would come from user data
    const simulatedStreak = Math.floor(Math.random() * 7) + 1
    setStreak(simulatedStreak)
    
    // Generate last 7 days
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const today = new Date().getDay()
    const generatedDays: StreakDay[] = days.map((day, index) => ({
      day,
      completed: index <= today && index >= today - simulatedStreak + 1,
      isToday: index === today
    }))
    setWeekDays(generatedDays)
    
    // Trigger animation after mount
    setTimeout(() => setShowAnimation(true), 100)
  }, [])

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-orange-500/10 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl animate-bounce">🔥</span>
            Learning Streak
          </h3>
          <div className={`text-3xl font-bold text-primary-400 transition-all duration-1000 ${
            showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {streak} days
          </div>
        </div>
        
        {/* Week visualization */}
        <div className="flex justify-between gap-2 mt-4">
          {weekDays.map((dayInfo, index) => (
            <div
              key={index}
              className={`flex flex-col items-center transition-all duration-500 ${
                showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-xs text-navy-400 mb-2">{dayInfo.day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  dayInfo.completed
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                    : 'bg-navy-800 text-navy-500'
                } ${dayInfo.isToday ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' : ''}`}
              >
                {dayInfo.completed ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Motivational message */}
        <p className="text-navy-400 text-sm mt-4 text-center">
          {streak >= 7 ? '🎉 Amazing! You\'re on fire!' : 
           streak >= 3 ? '💪 Great progress! Keep it up!' : 
           '🚀 Start your learning journey!'}
        </p>
      </div>
    </div>
  )
}