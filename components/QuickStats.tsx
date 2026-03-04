'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLessons: number
}

export default function QuickStats({ 
  totalCourses, 
  totalInstructors, 
  totalCategories,
  totalLessons 
}: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0
  })

  useEffect(() => {
    setAnimated(true)
    
    // Animate counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
        lessons: Math.round(totalLessons * easeOut)
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          instructors: totalInstructors,
          categories: totalCategories,
          lessons: totalLessons
        })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalCategories, totalLessons])

  const stats = [
    { 
      label: 'Courses', 
      value: counts.courses, 
      icon: '📚',
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-400'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖',
      color: 'from-green-500/20 to-green-600/20',
      textColor: 'text-green-400'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-400'
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️',
      color: 'from-orange-500/20 to-orange-600/20',
      textColor: 'text-orange-400'
    },
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 ${
      animated ? 'opacity-100' : 'opacity-0'
    }`}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.color} border border-navy-700/50 rounded-xl p-4 text-center transform transition-all duration-500 hover:scale-105`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.textColor}`}>
            {stat.value}+
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}