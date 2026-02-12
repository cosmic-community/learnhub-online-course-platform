'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningStats({ totalCourses, totalLessons, totalHours }: LearningStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedHours, setAnimatedHours] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)

  // Motivational messages
  const motivations = [
    "🚀 Keep pushing forward!",
    "💪 You've got this!",
    "⭐ Learning is your superpower!",
    "🎯 One step closer to mastery!",
    "🔥 You're on fire today!",
    "🌟 Great minds never stop learning!",
  ]

  const [motivation, setMotivation] = useState(motivations[0])

  useEffect(() => {
    // Animate numbers on mount
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      setAnimatedHours(Math.round(totalHours * easeOut))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('learnhub-streak', '1')
    }

    localStorage.setItem('learnhub-last-visit', today)

    // Random motivation
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)])
    
    // Show motivation after animation
    setTimeout(() => setShowMotivation(true), 2500)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalHours])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900/80 to-navy-800/50 border border-navy-700/50 p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Streak Badge */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Learning Dashboard
          </h3>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
            <span className="text-xl animate-bounce">🔥</span>
            <span className="text-orange-400 font-bold">{streak}</span>
            <span className="text-orange-300 text-sm">day streak</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 transition-transform group-hover:scale-110">
              {animatedCourses}
              <span className="text-primary-400">+</span>
            </div>
            <div className="text-navy-400 text-sm">Courses Available</div>
            <div className="mt-2 h-1 w-full bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-1000"
                style={{ width: `${Math.min(100, (animatedCourses / totalCourses) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 transition-transform group-hover:scale-110">
              {animatedLessons}
              <span className="text-primary-400">+</span>
            </div>
            <div className="text-navy-400 text-sm">Lessons to Explore</div>
            <div className="mt-2 h-1 w-full bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 delay-300"
                style={{ width: `${Math.min(100, (animatedLessons / totalLessons) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 transition-transform group-hover:scale-110">
              {animatedHours}
              <span className="text-primary-400">h</span>
            </div>
            <div className="text-navy-400 text-sm">Hours of Content</div>
            <div className="mt-2 h-1 w-full bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000 delay-500"
                style={{ width: `${Math.min(100, (animatedHours / totalHours) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Motivation Message */}
        <div 
          className={`mt-6 text-center transition-all duration-500 ${
            showMotivation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-primary-300 font-medium text-lg">{motivation}</p>
        </div>
      </div>
    </div>
  )
}