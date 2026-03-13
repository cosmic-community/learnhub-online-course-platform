'use client'

import { useState, useEffect, useRef } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '' 
}: { 
  end: number
  duration?: number
  suffix?: string 
}) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          let startTime: number
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  )
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  totalLessons 
}: QuickStatsProps) {
  const stats = [
    { 
      value: coursesCount, 
      suffix: '+', 
      label: 'Courses',
      icon: '📚',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      value: totalLessons, 
      suffix: '+', 
      label: 'Lessons',
      icon: '📖',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      value: instructorsCount, 
      suffix: '+', 
      label: 'Expert Instructors',
      icon: '👨‍🏫',
      color: 'from-green-500 to-green-600'
    },
    { 
      value: totalHours, 
      suffix: '+', 
      label: 'Hours of Content',
      icon: '⏱️',
      color: 'from-orange-500 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800 p-6 text-center hover:border-navy-700 transition-all duration-300 hover:transform hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient hover effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-navy-400 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}