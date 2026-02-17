'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  totalHours: number
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  
  return <span>{count}{suffix}</span>
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount,
  totalHours
}: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      value: coursesCount, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: lessonsCount, 
      label: 'Lessons', 
      icon: '📖',
      suffix: '+',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: totalHours, 
      label: 'Hours of Content', 
      icon: '⏱️',
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: instructorsCount, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-green-400 to-green-600'
    },
  ]

  return (
    <div className="mt-16">
      {/* Daily Streak Banner */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-orange-500/30 flex items-center justify-center gap-4">
          <span className="text-4xl animate-bounce-slow">🔥</span>
          <div className="text-center">
            <p className="text-orange-300 text-sm font-medium">Keep your streak going!</p>
            <p className="text-white font-bold">Learn something new every day</p>
          </div>
          <span className="text-4xl animate-bounce-slow" style={{ animationDelay: '150ms' }}>🔥</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={`
              relative bg-navy-900/50 backdrop-blur-sm rounded-2xl p-6 border border-navy-800 
              hover:border-navy-700 transition-all duration-300 group
              ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
            `}
            style={{ animationDelay: `${index * 100 + 300}ms` }}
          >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
            
            <div className="relative text-center">
              <span className="text-3xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </span>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {isVisible ? (
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <div className="text-navy-400 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}