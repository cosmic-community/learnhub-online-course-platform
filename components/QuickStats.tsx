'use client'

import { useEffect, useState } from 'react'

interface Props {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLessons: number
}

export default function QuickStats({ totalCourses, totalInstructors, totalCategories, totalLessons }: Props) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, instructors: 0, categories: 0, lessons: 0 })

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
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      setCounts({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
        lessons: Math.round(totalLessons * easeOut),
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          instructors: totalInstructors,
          categories: totalCategories,
          lessons: totalLessons,
        })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalCategories, totalLessons])

  const stats = [
    { label: 'Courses', value: counts.courses, icon: '📚', color: 'from-primary-500 to-primary-600' },
    { label: 'Instructors', value: counts.instructors, icon: '👨‍🏫', color: 'from-blue-500 to-blue-600' },
    { label: 'Categories', value: counts.categories, icon: '🏷️', color: 'from-purple-500 to-purple-600' },
    { label: 'Lessons', value: counts.lessons, icon: '📖', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-4 text-center transform transition-all duration-500 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stat.value}+</div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}