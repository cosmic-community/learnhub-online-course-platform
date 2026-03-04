'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLessons?: number
}

export default function QuickStats({ 
  totalCourses, 
  totalInstructors, 
  totalCategories,
  totalLessons = 0
}: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0,
  })

  useEffect(() => {
    // Animate counters
    const duration = 1500 // ms
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = easeOutQuart(currentStep / steps)
      
      setAnimatedValues({
        courses: Math.round(totalCourses * progress),
        instructors: Math.round(totalInstructors * progress),
        categories: Math.round(totalCategories * progress),
        lessons: Math.round(totalLessons * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          courses: totalCourses,
          instructors: totalInstructors,
          categories: totalCategories,
          lessons: totalLessons,
        })
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [totalCourses, totalInstructors, totalCategories, totalLessons])

  // Easing function for smooth animation
  function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4)
  }

  const stats = [
    { 
      value: animatedValues.courses, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
    },
    { 
      value: animatedValues.instructors, 
      label: 'Instructors', 
      icon: '👨‍🏫',
      color: 'from-purple-500 to-pink-500',
    },
    { 
      value: animatedValues.categories, 
      label: 'Categories', 
      icon: '🏷️',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  if (totalLessons > 0) {
    stats.push({ 
      value: animatedValues.lessons, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-orange-500 to-yellow-500',
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl bg-navy-900/50 border border-navy-800 p-4 hover:border-navy-700 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {stat.value}
              <span className="text-primary-400">+</span>
            </div>
            <div className="text-xs sm:text-sm text-navy-400">{stat.label}</div>
          </div>

          {/* Decorative corner */}
          <div className={`absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-300`} />
        </div>
      ))}
    </div>
  )
}