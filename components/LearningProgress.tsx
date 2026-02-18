'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [mounted, setMounted] = useState(false)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Motivational quotes that rotate
  const quotes = [
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is the passport to the future.", author: "Malcolm X" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  ]

  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    setMounted(true)
    
    // Simulate getting streak from localStorage
    const savedStreak = typeof window !== 'undefined' ? localStorage.getItem('learningStreak') : null
    const parsedStreak = savedStreak ? parseInt(savedStreak, 10) : Math.floor(Math.random() * 7) + 1
    setStreak(parsedStreak)
    
    // Rotate quotes based on day
    const dayIndex = new Date().getDay() % quotes.length
    setCurrentQuote(quotes[dayIndex])

    // Animate the progress ring
    const timer = setTimeout(() => {
      setAnimatedProgress(75) // Simulated progress
    }, 500)

    // Show confetti for streaks >= 3
    if (parsedStreak >= 3) {
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }, 1500)
      return () => {
        clearTimeout(timer)
        clearTimeout(confettiTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-8 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Progress Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-navy-800"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{animatedProgress}%</span>
                <span className="text-xs text-navy-400">Progress</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-navy-400">Keep learning to level up!</p>
          </div>

          {/* Streak Counter */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className={`text-6xl ${streak >= 3 ? 'animate-flame' : ''}`}>
                🔥
              </div>
              {streak >= 7 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs">⭐</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-4xl font-bold text-white">{streak}</span>
              <span className="text-lg text-navy-400 ml-2">day streak</span>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < streak
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 scale-110'
                      : 'bg-navy-700'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-navy-500">
              {streak >= 7 ? '🎉 Amazing week!' : streak >= 3 ? '🚀 Great momentum!' : '💪 Keep it up!'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-navy-800/50 rounded-xl">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalCourses}</p>
                <p className="text-xs text-navy-400">Available Courses</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-navy-800/50 rounded-xl">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📖</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalLessons}</p>
                <p className="text-xs text-navy-400">Total Lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-navy-800/50 rounded-xl">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalHours}+</p>
                <p className="text-xs text-navy-400">Hours of Content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 pt-6 border-t border-navy-800">
          <div className="flex items-start gap-3">
            <span className="text-3xl text-primary-500/50">"</span>
            <div>
              <p className="text-navy-300 italic">{currentQuote.text}</p>
              <p className="text-sm text-navy-500 mt-1">— {currentQuote.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}