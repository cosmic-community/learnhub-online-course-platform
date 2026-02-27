'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [visitCount, setVisitCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get visit count from streak data
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      const data = JSON.parse(stored)
      setVisitCount(data.totalVisits || 1)
    }
    
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      label: 'Courses', 
      value: totalCourses, 
      icon: '📚',
      color: 'from-blue-500/20 to-blue-600/10',
      delay: 0 
    },
    { 
      label: 'Lessons', 
      value: totalLessons, 
      icon: '📖',
      color: 'from-green-500/20 to-green-600/10',
      delay: 100 
    },
    { 
      label: 'Instructors', 
      value: totalInstructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500/20 to-purple-600/10',
      delay: 200 
    },
    { 
      label: 'Your Visits', 
      value: visitCount, 
      icon: '👋',
      color: 'from-primary-500/20 to-primary-600/10',
      delay: 300 
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            relative overflow-hidden rounded-xl p-4
            bg-gradient-to-br ${stat.color}
            border border-navy-800/50
            transition-all duration-500 ease-out
            ${isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
          `}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold text-white">
                <AnimatedNumber value={stat.value} delay={stat.delay + 500} />
              </div>
              <div className="text-xs text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000
      const steps = 30
      const increment = value / steps
      let current = 0
      
      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return <span>{displayValue}+</span>
}