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
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(eased * totalCourses))
      setAnimatedLessons(Math.round(eased * totalLessons))
      setAnimatedInstructors(Math.round(eased * totalInstructors))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      value: animatedCourses, 
      label: 'Courses', 
      icon: '📚', 
      color: 'from-primary-500 to-primary-600',
      description: 'Expert-crafted courses'
    },
    { 
      value: animatedLessons, 
      label: 'Lessons', 
      icon: '📖', 
      color: 'from-blue-500 to-blue-600',
      description: 'Hands-on lessons'
    },
    { 
      value: animatedInstructors, 
      label: 'Instructors', 
      icon: '👨‍🏫', 
      color: 'from-purple-500 to-purple-600',
      description: 'Industry experts'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ease-out ${index * 0.15}s`
          }}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div 
            className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
          >
            {stat.value}+
          </div>
          <div className="text-white font-semibold mb-1">{stat.label}</div>
          <div className="text-navy-400 text-sm">{stat.description}</div>
        </div>
      ))}
    </div>
  )
}