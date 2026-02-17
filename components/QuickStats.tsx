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
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      
      setCounts({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
        categories: Math.round(totalCategories * eased)
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
      color: 'from-blue-500/20 to-blue-500/5',
      textColor: 'text-blue-400'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖',
      color: 'from-green-500/20 to-green-500/5',
      textColor: 'text-green-400'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500/20 to-purple-500/5',
      textColor: 'text-purple-400'
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️',
      color: 'from-orange-500/20 to-orange-500/5',
      textColor: 'text-orange-400'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-4 text-center bg-gradient-to-br ${stat.color} transition-all duration-500 hover:scale-105`}
          style={{ 
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${index * 100}ms`
          }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.textColor}`}>
            {stat.value}+
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}