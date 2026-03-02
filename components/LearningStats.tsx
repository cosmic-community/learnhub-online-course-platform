'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalHours: number
  totalLessons: number
}

export default function LearningStats({ totalCourses, totalHours, totalLessons }: LearningStatsProps) {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [animatedStreak, setAnimatedStreak] = useState(0)

  useEffect(() => {
    // Get stored streak data from localStorage
    const storedStreak = localStorage.getItem('learnhub-streak')
    const storedLastVisit = localStorage.getItem('learnhub-last-visit')
    
    const today = new Date().toDateString()
    
    if (storedLastVisit) {
      const lastVisitDate = new Date(storedLastVisit)
      const daysDiff = Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 0) {
        // Same day, keep streak
        setStreak(parseInt(storedStreak || '1'))
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        const newStreak = (parseInt(storedStreak || '0')) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        localStorage.setItem('learnhub-last-visit', today)
      } else {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
        localStorage.setItem('learnhub-last-visit', today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub-streak', '1')
      localStorage.setItem('learnhub-last-visit', today)
    }
    
    setLastVisit(today)
  }, [])

  // Animate the streak counter
  useEffect(() => {
    if (streak > 0) {
      const duration = 1000
      const steps = 20
      const increment = streak / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= streak) {
          setAnimatedStreak(streak)
          clearInterval(timer)
        } else {
          setAnimatedStreak(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [streak])

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "You're a learning champion!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "A whole week! Incredible!"
    if (streak >= 3) return "Great momentum!"
    return "Starting your journey!"
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{getStreakEmoji()}</span>
          <h3 className="text-lg font-semibold text-white">Your Learning Journey</h3>
        </div>
        
        {/* Streak Counter */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              {animatedStreak}
            </span>
            <span className="text-navy-300 text-lg">day streak</span>
          </div>
          <p className="text-navy-400 text-sm mt-1">{getStreakMessage()}</p>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalCourses}</div>
            <div className="text-xs text-navy-400">Courses</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalHours}h</div>
            <div className="text-xs text-navy-400">Content</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalLessons}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
        </div>

        {/* Streak Calendar Preview */}
        <div className="mt-4 pt-4 border-t border-navy-700">
          <p className="text-xs text-navy-400 mb-2">This Week</p>
          <div className="flex justify-between">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
              const today = new Date().getDay()
              const isToday = index === today
              const isPast = index < today
              const isActive = isPast || isToday
              
              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    isToday
                      ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900'
                      : isActive
                      ? 'bg-primary-500/30 text-primary-300'
                      : 'bg-navy-800 text-navy-500'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}