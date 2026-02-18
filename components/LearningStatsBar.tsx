'use client'

import { useState, useEffect } from 'react'

interface LearningStatsBarProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  totalInstructors: number
}

export default function LearningStatsBar({ 
  totalCourses, 
  totalLessons, 
  totalHours, 
  totalInstructors 
}: LearningStatsBarProps) {
  const [streak, setStreak] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(20) // minutes
  const [todayMinutes, setTodayMinutes] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate getting learning data from localStorage
    const savedStreak = localStorage.getItem('learningStreak')
    const savedToday = localStorage.getItem('todayLearningMinutes')
    const lastVisit = localStorage.getItem('lastLearningDate')
    const today = new Date().toDateString()

    if (savedStreak) {
      // Check if streak should continue
      if (lastVisit === today || lastVisit === new Date(Date.now() - 86400000).toDateString()) {
        setStreak(parseInt(savedStreak))
      } else {
        // Reset streak if more than a day has passed
        setStreak(0)
        localStorage.setItem('learningStreak', '0')
      }
    }

    if (savedToday && lastVisit === today) {
      setTodayMinutes(parseInt(savedToday))
    }
  }, [])

  useEffect(() => {
    // Celebrate when daily goal is met
    if (todayMinutes >= dailyGoal && !showCelebration) {
      setShowCelebration(true)
      // Update streak
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('learningStreak', newStreak.toString())
      localStorage.setItem('lastLearningDate', new Date().toDateString())
      
      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [todayMinutes, dailyGoal, streak, showCelebration])

  const progressPercent = Math.min((todayMinutes / dailyGoal) * 100, 100)

  if (!isVisible) return null

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-navy-900/95 backdrop-blur-lg p-8 rounded-2xl border border-primary-500 text-center animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Daily Goal Complete!</h3>
              <p className="text-navy-300">You&apos;re on a {streak} day streak!</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-primary-600/20 via-navy-900 to-primary-600/20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Streak Counter */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="text-2xl animate-pulse">🔥</span>
                  {streak > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {streak}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{streak} Day Streak</div>
                  <div className="text-xs text-navy-400">Keep learning daily!</div>
                </div>
              </div>
              
              {/* Daily Progress */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-navy-400 mb-1">Today&apos;s Goal: {todayMinutes}/{dailyGoal}min</span>
                  <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-green-500 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                {progressPercent >= 100 && (
                  <span className="text-green-400 text-lg">✓</span>
                )}
              </div>
            </div>

            {/* Center: Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-navy-300">
                <span>📚</span>
                <span>{totalCourses} Courses</span>
              </div>
              <div className="flex items-center gap-2 text-navy-300">
                <span>📖</span>
                <span>{totalLessons} Lessons</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-navy-300">
                <span>⏱️</span>
                <span>{totalHours}+ Hours</span>
              </div>
            </div>

            {/* Right: Dismiss Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="text-navy-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}