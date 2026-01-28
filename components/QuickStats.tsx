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
    categories: 0,
  })

  useEffect(() => {
    setAnimated(true)
    
    // Animate counting up
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      setCounts({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
        categories: Math.round(totalCategories * eased),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          lessons: totalLessons,
          instructors: totalInstructors,
          categories: totalCategories,
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
      color: 'from-blue-500 to-cyan-500',
      suffix: '+',
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖', 
      color: 'from-purple-500 to-pink-500',
      suffix: '+',
    },
    { 
      label: 'Expert Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫', 
      color: 'from-orange-500 to-yellow-500',
      suffix: '',
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️', 
      color: 'from-green-500 to-emerald-500',
      suffix: '',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-6 text-center transform transition-all duration-500 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5`}>
            <div className="w-full h-full bg-navy-900 rounded-2xl flex items-center justify-center text-2xl">
              {stat.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}