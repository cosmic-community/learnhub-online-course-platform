'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      value: totalCourses, 
      label: 'Courses', 
      icon: '📚', 
      color: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    { 
      value: totalLessons, 
      label: 'Lessons', 
      icon: '📖', 
      color: 'from-green-500 to-green-600',
      delay: '100ms'
    },
    { 
      value: totalInstructors, 
      label: 'Experts', 
      icon: '👨‍🏫', 
      color: 'from-purple-500 to-purple-600',
      delay: '200ms'
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 transform transition-all duration-500 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: stat.delay }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-white">
            <AnimatedNumber value={stat.value} delay={index * 100} />
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500
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
    }, delay + 500)
    
    return () => clearTimeout(timer)
  }, [value, delay])

  return <span>{displayValue}+</span>
}