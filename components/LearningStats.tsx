'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
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
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export default function LearningStats({ 
  totalCourses, 
  totalLessons, 
  totalInstructors, 
  totalCategories 
}: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      label: 'Courses',
      value: totalCourses,
      suffix: '+',
      icon: '📚',
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-500/10',
      delay: 0,
    },
    {
      label: 'Lessons',
      value: totalLessons,
      suffix: '+',
      icon: '📖',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
      delay: 100,
    },
    {
      label: 'Expert Instructors',
      value: totalInstructors,
      suffix: '+',
      icon: '👨‍🏫',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
      delay: 200,
    },
    {
      label: 'Categories',
      value: totalCategories,
      suffix: '',
      icon: '🏷️',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
      delay: 300,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative group overflow-hidden rounded-2xl p-6 ${stat.bgColor} border border-navy-800 hover:border-navy-700 transition-all duration-500 hover:scale-[1.02] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          {/* Animated gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
          
          {/* Icon with pulse animation */}
          <div className="relative mb-3">
            <span className="text-3xl block transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </span>
            <div className={`absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
          </div>

          {/* Counter */}
          <div className="relative">
            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {isVisible && (
                <AnimatedCounter 
                  end={stat.value} 
                  duration={2000 + index * 200} 
                  suffix={stat.suffix} 
                />
              )}
            </div>
            <div className="text-navy-400 text-sm mt-1 font-medium">
              {stat.label}
            </div>
          </div>

          {/* Decorative corner element */}
          <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />
        </div>
      ))}
    </div>
  )
}