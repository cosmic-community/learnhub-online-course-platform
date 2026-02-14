'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
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
    
    // Animate numbers counting up
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      setCounts({
        courses: Math.round(coursesCount * easeOut),
        instructors: Math.round(instructorsCount * easeOut),
        categories: Math.round(categoriesCount * easeOut),
        lessons: Math.round(lessonsCount * easeOut)
      })
      
      if (currentStep >= steps) {
        clearInterval(timer)
        setCounts({
          courses: coursesCount,
          instructors: instructorsCount,
          categories: categoriesCount,
          lessons: lessonsCount
        })
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount, lessonsCount])

  const stats = [
    { 
      label: 'Courses', 
      value: counts.courses, 
      icon: '📚',
      color: 'from-primary-500 to-primary-600'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️',
      color: 'from-amber-500 to-amber-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800 p-6 text-center transition-all duration-500 hover:border-navy-700 hover:shadow-lg ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
          
          <div className="relative">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
              {stat.value}+
            </div>
            <div className="text-navy-400 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}