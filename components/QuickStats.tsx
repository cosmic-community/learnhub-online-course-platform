'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
  })

  useEffect(() => {
    const duration = 1500 // Animation duration in ms
    const steps = 30
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      label: 'Courses', 
      value: animatedValues.courses, 
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    { 
      label: 'Lessons', 
      value: animatedValues.lessons, 
      icon: '📖',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    { 
      label: 'Expert Instructors', 
      value: animatedValues.instructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`card p-6 ${stat.bgColor} border-transparent hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums`}>
                {stat.value}+
              </div>
              <div className="text-navy-400 text-sm">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}