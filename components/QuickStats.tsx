'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease out
      
      setAnimatedCourses(Math.floor(totalCourses * easeOut))
      setAnimatedLessons(Math.floor(totalLessons * easeOut))
      setAnimatedInstructors(Math.floor(totalInstructors * easeOut))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedCourses(totalCourses)
        setAnimatedLessons(totalLessons)
        setAnimatedInstructors(totalInstructors)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      value: animatedCourses, 
      label: 'Courses', 
      icon: '📚', 
      color: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    { 
      value: animatedLessons, 
      label: 'Lessons', 
      icon: '📖', 
      color: 'from-green-500 to-green-600',
      delay: '100ms'
    },
    { 
      value: animatedInstructors, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫', 
      color: 'from-purple-500 to-purple-600',
      delay: '200ms'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.color} transition-all duration-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: stat.delay }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-black/10 rounded-full blur-xl" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-white">
                {stat.value}
                <span className="text-2xl text-white/80">+</span>
              </p>
            </div>
            <span className="text-5xl opacity-80">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}