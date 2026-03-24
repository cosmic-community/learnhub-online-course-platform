'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

export default function QuickStats({ 
  totalCourses, 
  totalLessons, 
  totalInstructors, 
  totalCategories 
}: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
    categories: 0
  })

  useEffect(() => {
    // Animate numbers counting up
    const duration = 1500 // ms
    const steps = 30
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
        categories: Math.round(totalCategories * eased)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues({
          courses: totalCourses,
          lessons: totalLessons,
          instructors: totalInstructors,
          categories: totalCategories
        })
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [totalCourses, totalLessons, totalInstructors, totalCategories])

  const stats = [
    { 
      label: 'Courses', 
      value: animatedValues.courses, 
      icon: '📚',
      color: 'from-blue-500/20 to-blue-600/10',
      textColor: 'text-blue-400'
    },
    { 
      label: 'Lessons', 
      value: animatedValues.lessons, 
      icon: '📖',
      color: 'from-green-500/20 to-green-600/10',
      textColor: 'text-green-400'
    },
    { 
      label: 'Instructors', 
      value: animatedValues.instructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500/20 to-purple-600/10',
      textColor: 'text-purple-400'
    },
    { 
      label: 'Categories', 
      value: animatedValues.categories, 
      icon: '🏷️',
      color: 'from-orange-500/20 to-orange-600/10',
      textColor: 'text-orange-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            card p-4 text-center
            bg-gradient-to-br ${stat.color}
            transform transition-all duration-300
            hover:scale-105 hover:shadow-lg
          `}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.5s ease-out forwards'
          }}
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.textColor}`}>
            {stat.value}+
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}