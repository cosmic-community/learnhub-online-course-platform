'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalInstructors }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Simulated streak (in production, this would come from user data)
  useEffect(() => {
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }
    localStorage.setItem('last-visit-date', today)

    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  // Animate progress ring
  useEffect(() => {
    if (isVisible) {
      const targetProgress = Math.min((streak / 30) * 100, 100) // 30-day goal
      const duration = 1500
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        setAnimatedProgress(targetProgress * eased)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isVisible, streak])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return "You're on fire!"
    if (streak >= 7) return 'Amazing dedication!'
    if (streak >= 3) return 'Keep it up!'
    return 'Great start!'
  }

  return (
    <div className={`card p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center gap-6">
        {/* Animated Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-navy-700"
            />
            {/* Progress circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#progress-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 0.1s ease-out',
              }}
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl">{getStreakEmoji()}</span>
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-xs text-navy-400">day{streak !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Stats and Message */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full">
              {getStreakMessage()}
            </span>
          </div>
          <p className="text-navy-400 text-sm mb-4">
            You&apos;ve been learning for {streak} consecutive day{streak !== 1 ? 's' : ''}! 
            {streak < 30 && ` Keep going to reach your 30-day goal!`}
          </p>
          
          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-2 bg-navy-800/50 rounded-lg">
              <div className="text-lg font-bold text-white">{totalCourses}</div>
              <div className="text-xs text-navy-400">Courses</div>
            </div>
            <div className="text-center p-2 bg-navy-800/50 rounded-lg">
              <div className="text-lg font-bold text-white">{totalLessons}</div>
              <div className="text-xs text-navy-400">Lessons</div>
            </div>
            <div className="text-center p-2 bg-navy-800/50 rounded-lg">
              <div className="text-lg font-bold text-white">{totalInstructors}</div>
              <div className="text-xs text-navy-400">Experts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar to 30-day goal */}
      <div className="mt-4 pt-4 border-t border-navy-700">
        <div className="flex justify-between text-xs text-navy-400 mb-1">
          <span>Progress to 30-day streak</span>
          <span>{Math.min(streak, 30)}/30 days</span>
        </div>
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}