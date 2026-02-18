'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalHours: number
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export default function LearningStats({ totalCourses, totalLessons, totalInstructors, totalHours }: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Simulate a learning streak (in a real app, this would come from user data)
    const randomStreak = Math.floor(Math.random() * 30) + 1
    setStreak(randomStreak)
    
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      icon: '📚',
      value: totalCourses,
      label: 'Courses',
      suffix: '+',
      color: 'from-teal-400 to-emerald-500',
    },
    {
      icon: '📖',
      value: totalLessons,
      label: 'Lessons',
      suffix: '+',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: '👨‍🏫',
      value: totalInstructors,
      label: 'Expert Instructors',
      suffix: '',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: '⏱️',
      value: totalHours,
      label: 'Hours of Content',
      suffix: '+',
      color: 'from-orange-400 to-yellow-500',
    },
  ]

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Streak Banner */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full">
          <span className="text-2xl animate-bounce">🔥</span>
          <span className="text-orange-300 font-medium">
            Join <span className="text-orange-400 font-bold">{streak.toLocaleString()}K+</span> learners this week!
          </span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative group"
            style={{ 
              transitionDelay: `${index * 100}ms`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
            
            <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center hover:border-navy-700 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {isVisible && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}