'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  courses: number
  instructors: number
  categories: number
  lessons: number
}

export default function QuickStats({ courses, instructors, categories, lessons }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0
  })

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

      setAnimatedValues({
        courses: Math.round(courses * easeOut),
        instructors: Math.round(instructors * easeOut),
        categories: Math.round(categories * easeOut),
        lessons: Math.round(lessons * easeOut)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [courses, instructors, categories, lessons])

  const stats = [
    { 
      label: 'Courses', 
      value: animatedValues.courses, 
      icon: '📚',
      suffix: '+',
      color: 'from-primary-500 to-teal-400'
    },
    { 
      label: 'Lessons', 
      value: animatedValues.lessons, 
      icon: '📖',
      suffix: '+',
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      label: 'Expert Instructors', 
      value: animatedValues.instructors, 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-purple-500 to-pink-400'
    },
    { 
      label: 'Categories', 
      value: animatedValues.categories, 
      icon: '🏷️',
      suffix: '',
      color: 'from-orange-500 to-amber-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}