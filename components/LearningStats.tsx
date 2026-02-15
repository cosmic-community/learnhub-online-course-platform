'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

const tips = [
  { emoji: '🎯', tip: "Set specific goals for each study session to stay focused." },
  { emoji: '⏰', tip: "The Pomodoro Technique: 25 minutes of focus, 5 minute break." },
  { emoji: '📝', tip: "Taking notes by hand improves retention by 30%." },
  { emoji: '🧠', tip: "Teaching others what you learn solidifies your understanding." },
  { emoji: '💪', tip: "Consistency beats intensity. Small daily progress adds up!" },
  { emoji: '🌙', tip: "Your brain processes learning during sleep. Rest well!" },
  { emoji: '🔄', tip: "Review material 24 hours after learning for better retention." },
  { emoji: '🎮', tip: "Gamify your learning! Track streaks and celebrate wins." },
]

export default function LearningStats({ totalCourses, totalLessons, totalInstructors }: LearningStatsProps) {
  const [streak, setStreak] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading animation
    setIsVisible(true)
    
    // Animate progress ring
    const timer = setTimeout(() => {
      setProgress(75) // Simulated progress percentage
    }, 500)

    // Get random tip
    setTipIndex(Math.floor(Math.random() * tips.length))
    
    // Simulate streak from localStorage (in real app, would come from user data)
    const savedStreak = typeof window !== 'undefined' 
      ? parseInt(localStorage.getItem('learningStreak') || '0', 10)
      : 0
    setStreak(savedStreak || Math.floor(Math.random() * 14) + 1)

    return () => clearTimeout(timer)
  }, [])

  const handleStartLearning = () => {
    // Update streak
    const newStreak = streak + 1
    setStreak(newStreak)
    if (typeof window !== 'undefined') {
      localStorage.setItem('learningStreak', newStreak.toString())
    }
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="card p-8 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Streak */}
          <div className="text-center lg:border-r lg:border-navy-700 lg:pr-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-6">
                <span className="text-4xl">🔥</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{streak}</div>
            <div className="text-navy-400 text-sm">Day Streak</div>
            <p className="text-xs text-navy-500 mt-2">Keep learning daily!</p>
          </div>

          {/* Progress Ring */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-navy-800"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1.5s ease-out'
                  }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-2xl font-bold text-white">{progress}%</div>
                  <div className="text-xs text-navy-400">Complete</div>
                </div>
              </div>
            </div>
            <p className="text-navy-300 text-sm">Your Learning Journey</p>
          </div>

          {/* Tip of the Day */}
          <div className="text-center lg:border-l lg:border-navy-700 lg:pl-8 flex flex-col justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded-full mb-4 mx-auto">
              <span className="text-2xl">{tips[tipIndex].emoji}</span>
            </div>
            <h4 className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
              💡 Tip of the Day
            </h4>
            <p className="text-navy-300 text-sm leading-relaxed">
              {tips[tipIndex].tip}
            </p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-navy-800">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-400">📚</span>
              <span className="text-navy-400">{totalCourses} Courses Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-400">📖</span>
              <span className="text-navy-400">{totalLessons} Total Lessons</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-400">👨‍🏫</span>
              <span className="text-navy-400">{totalInstructors} Expert Instructors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}