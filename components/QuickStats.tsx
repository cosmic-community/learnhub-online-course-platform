'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [displayValues, setDisplayValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
  })

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    const duration = 1500 // Animation duration in ms
    const steps = 60 // Number of steps
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayValues({
        courses: Math.round(totalCourses * easeProgress),
        lessons: Math.round(totalLessons * easeProgress),
        instructors: Math.round(totalInstructors * easeProgress),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animated, totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      label: 'Courses', 
      value: displayValues.courses, 
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      description: 'Expert-led courses'
    },
    { 
      label: 'Lessons', 
      value: displayValues.lessons, 
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
      description: 'Hours of content'
    },
    { 
      label: 'Instructors', 
      value: displayValues.instructors, 
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-500',
      description: 'Industry experts'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-xl p-6 hover:border-navy-700 transition-all duration-300 overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Gradient overlay on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          />
          
          <div className="relative flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="text-primary-400 font-bold">+</span>
              </div>
              <div className="text-navy-400 text-sm">{stat.label}</div>
            </div>
          </div>
          
          <p className="mt-3 text-navy-500 text-xs">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}