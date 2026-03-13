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
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
    categories: 0
  })

  useEffect(() => {
    setAnimated(true)
    
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      setCounts({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut)
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          lessons: totalLessons,
          instructors: totalInstructors,
          categories: totalCategories
        })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors, totalCategories])

  const stats = [
    { 
      label: 'Courses', 
      value: counts.courses, 
      icon: '📚', 
      color: 'from-blue-500 to-blue-600',
      suffix: '+'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖', 
      color: 'from-green-500 to-green-600',
      suffix: '+'
    },
    { 
      label: 'Expert Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫', 
      color: 'from-purple-500 to-purple-600',
      suffix: ''
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️', 
      color: 'from-orange-500 to-orange-600',
      suffix: ''
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-6 text-center group hover:scale-105 transition-all duration-300 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}