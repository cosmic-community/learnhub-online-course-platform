'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [showSparkle, setShowSparkle] = useState(false)
  
  // Simulate a learning progress (in real app, this would come from user data)
  const targetProgress = 35 // percentage
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= targetProgress) {
            clearInterval(interval)
            setShowSparkle(true)
            return targetProgress
          }
          return prev + 1
        })
      }, 30)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  return (
    <div className="relative">
      {/* Progress Ring */}
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-navy-800"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{animatedProgress}%</span>
          <span className="text-xs text-navy-400">Progress</span>
        </div>
        
        {/* Sparkle effect */}
        {showSparkle && (
          <div className="absolute -top-1 -right-1 animate-bounce">
            <span className="text-2xl">✨</span>
          </div>
        )}
      </div>
      
      {/* Stats below */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="group cursor-default">
          <div className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {totalCourses}
          </div>
          <div className="text-xs text-navy-400">Courses</div>
        </div>
        <div className="group cursor-default">
          <div className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {totalLessons}
          </div>
          <div className="text-xs text-navy-400">Lessons</div>
        </div>
        <div className="group cursor-default">
          <div className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {totalHours}h
          </div>
          <div className="text-xs text-navy-400">Content</div>
        </div>
      </div>
    </div>
  )
}