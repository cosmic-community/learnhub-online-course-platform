'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ 
  totalCourses, 
  totalLessons, 
  totalHours 
}: LearningProgressProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Simulate learning progress (in a real app, this would come from user data)
  const targetProgress = 68 // percentage

  useEffect(() => {
    setIsVisible(true)
    
    // Animate the progress ring
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= targetProgress) {
            clearInterval(interval)
            return targetProgress
          }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(interval)
    }, 500)

    // Simulate streak (would come from localStorage or user data in real app)
    const savedStreak = typeof window !== 'undefined' 
      ? parseInt(localStorage.getItem('learningStreak') || '0', 10)
      : 0
    setStreak(savedStreak || 7) // Default to 7 for demo

    return () => clearTimeout(timer)
  }, [])

  const handleStartLearning = () => {
    setShowConfetti(true)
    // Update streak
    const newStreak = streak + 1
    setStreak(newStreak)
    if (typeof window !== 'undefined') {
      localStorage.setItem('learningStreak', newStreak.toString())
    }
    setTimeout(() => setShowConfetti(false), 2000)
  }

  // SVG circle parameters
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-8 bg-gradient-to-br from-navy-900/80 via-navy-900/50 to-primary-900/20">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-navy-800"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-white">{animatedProgress}%</span>
                <span className="block text-xs text-navy-400">Complete</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              Your Learning Journey 🚀
            </h3>
            <p className="text-navy-300 mb-4">
              You&apos;re making great progress! Keep up the momentum.
            </p>
            
            {/* Mini stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-4">
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg px-3 py-2">
                <span className="text-lg">📚</span>
                <div>
                  <div className="text-sm font-semibold text-white">{totalCourses}</div>
                  <div className="text-xs text-navy-400">Courses</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg px-3 py-2">
                <span className="text-lg">📖</span>
                <div>
                  <div className="text-sm font-semibold text-white">{totalLessons}</div>
                  <div className="text-xs text-navy-400">Lessons</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg px-3 py-2">
                <span className="text-lg">⏱️</span>
                <div>
                  <div className="text-sm font-semibold text-white">{totalHours}h</div>
                  <div className="text-xs text-navy-400">Content</div>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex-shrink-0 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse-slow">
                <div className="text-center">
                  <span className="text-2xl">🔥</span>
                  <div className="text-xl font-bold text-white">{streak}</div>
                </div>
              </div>
              {streak >= 7 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs animate-bounce">
                  ⭐
                </div>
              )}
            </div>
            <p className="text-sm text-navy-300 mt-2">Day Streak!</p>
            <button
              onClick={handleStartLearning}
              className="mt-3 text-xs bg-navy-800 hover:bg-navy-700 text-primary-400 px-3 py-1.5 rounded-full transition-all hover:scale-105"
            >
              Continue Learning →
            </button>
          </div>
        </div>

        {/* Achievement badges */}
        <div className="mt-6 pt-6 border-t border-navy-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-navy-400">Recent Achievements:</span>
              <div className="flex gap-1">
                {['🎯', '💡', '🏆', '⚡'].map((emoji, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-sm hover:scale-110 transition-transform cursor-pointer"
                    title={['First Course', 'Quick Learner', 'Week Warrior', 'Speed Demon'][i]}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-sm text-navy-400">
              <span className="text-primary-400 font-semibold">+150 XP</span> this week
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}