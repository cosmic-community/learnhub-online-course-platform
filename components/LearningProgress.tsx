'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function LearningProgress({ 
  totalCourses, 
  totalLessons, 
  totalInstructors 
}: LearningProgressProps) {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('👋')
  const [suggestion, setSuggestion] = useState('')
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
      setEmoji('🌅')
      setSuggestion('Start your day with a quick lesson!')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
      setEmoji('☀️')
      setSuggestion('Perfect time for focused learning!')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
      setEmoji('🌆')
      setSuggestion('Wind down with some new skills!')
    } else {
      setGreeting('Hello, night owl')
      setEmoji('🦉')
      setSuggestion('Late night learning session?')
    }

    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      setStreak(parseInt(savedStreak || '1', 10))
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        const newStreak = parseInt(savedStreak || '0', 10) + 1
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

    // Trigger visibility for animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Animate numbers
  useEffect(() => {
    if (!isVisible) return
    
    const duration = 1500
    const steps = 60
    const courseStep = totalCourses / steps
    const lessonStep = totalLessons / steps
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedCourses(Math.min(Math.round(courseStep * currentStep), totalCourses))
      setAnimatedLessons(Math.min(Math.round(lessonStep * currentStep), totalLessons))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Learning Legend!"
    if (streak >= 14) return "🔥 On Fire!"
    if (streak >= 7) return "⭐ Week Warrior!"
    if (streak >= 3) return "💪 Building Momentum!"
    return "🌱 Getting Started!"
  }

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        {/* Greeting Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl animate-bounce">{emoji}</span>
              {greeting}!
            </h3>
            <p className="text-navy-300 mt-1">{suggestion}</p>
          </div>
          
          {/* Streak Badge */}
          <div className="text-center bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl p-4 border border-primary-500/30">
            <div className="text-3xl font-bold text-primary-400">{streak}</div>
            <div className="text-xs text-navy-300">day streak</div>
            <div className="text-xs text-primary-300 mt-1">{getStreakMessage()}</div>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-navy-800/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-white tabular-nums">
              {animatedCourses}
            </div>
            <div className="text-sm text-navy-400">Courses</div>
            <div className="h-1 bg-navy-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                style={{ width: isVisible ? '100%' : '0%' }}
              />
            </div>
          </div>
          
          <div className="bg-navy-800/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-white tabular-nums">
              {animatedLessons}
            </div>
            <div className="text-sm text-navy-400">Lessons</div>
            <div className="h-1 bg-navy-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 delay-200"
                style={{ width: isVisible ? '100%' : '0%' }}
              />
            </div>
          </div>
          
          <div className="bg-navy-800/50 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-white tabular-nums">
              {totalInstructors}
            </div>
            <div className="text-sm text-navy-400">Experts</div>
            <div className="h-1 bg-navy-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 delay-400"
                style={{ width: isVisible ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center justify-between bg-navy-800/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="text-white font-medium">Ready to learn something new?</div>
              <div className="text-navy-400 text-sm">Pick up where you left off or explore</div>
            </div>
          </div>
          <Link 
            href="/courses" 
            className="btn-primary text-sm whitespace-nowrap"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  )
}