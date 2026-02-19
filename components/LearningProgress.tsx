'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedHours, setAnimatedHours] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Check and update streak on component mount
  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('learnhub_last_visit')
    const storedStreak = parseInt(localStorage.getItem('learnhub_streak') || '0')

    if (storedDate === today) {
      // Already visited today
      setStreak(storedStreak)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (storedDate === yesterday.toDateString()) {
        // Continued streak!
        const newStreak = storedStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub_streak', newStreak.toString())
        localStorage.setItem('learnhub_last_visit', today)
        
        // Show confetti for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 1) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learnhub_streak', '1')
        localStorage.setItem('learnhub_last_visit', today)
      }
    }
    
    setIsVisible(true)
  }, [])

  // Animate numbers
  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      setAnimatedHours(Math.round(totalHours * easeOut))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalHours])

  const getStreakMessage = () => {
    if (streak === 0) return "Start your learning journey!"
    if (streak === 1) return "🎉 Day 1 - Great start!"
    if (streak < 7) return `🔥 ${streak} day streak!`
    if (streak < 30) return `🔥🔥 ${streak} days - On fire!`
    return `🏆 ${streak} days - Learning Champion!`
  }

  const getStreakEmoji = () => {
    if (streak === 0) return "🌱"
    if (streak < 3) return "🌿"
    if (streak < 7) return "🔥"
    if (streak < 14) return "⚡"
    if (streak < 30) return "🚀"
    return "🏆"
  }

  return (
    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-navy-900/80 to-navy-800/80 backdrop-blur-sm rounded-2xl p-6 border border-navy-700/50">
        {/* Streak Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl animate-pulse-slow">
              {getStreakEmoji()}
            </div>
            <div>
              <p className="text-sm text-navy-400">Daily Streak</p>
              <p className="text-lg font-bold text-white">{getStreakMessage()}</p>
            </div>
          </div>
          
          {/* Streak Progress */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < (streak % 7 || (streak > 0 ? 7 : 0))
                    ? 'bg-primary-400 scale-100'
                    : 'bg-navy-700 scale-75'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800/70 transition-colors group">
            <div className="text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">
              {animatedCourses}+
            </div>
            <div className="text-navy-400 text-sm mt-1">Courses</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800/70 transition-colors group">
            <div className="text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">
              {animatedLessons}+
            </div>
            <div className="text-navy-400 text-sm mt-1">Lessons</div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800/70 transition-colors group">
            <div className="text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">
              {animatedHours}+
            </div>
            <div className="text-navy-400 text-sm mt-1">Hours</div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-6 pt-4 border-t border-navy-700/50">
          <p className="text-center text-navy-300 text-sm italic">
            "The expert in anything was once a beginner." — Helen Hayes
          </p>
        </div>
      </div>
    </div>
  )
}