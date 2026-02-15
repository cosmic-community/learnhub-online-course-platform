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
    // Trigger animation on mount
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.round(totalCourses * eased),
        instructors: Math.round(totalInstructors * eased),
        categories: Math.round(totalCategories * eased),
        lessons: Math.round(totalLessons * eased)
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
  }, [animated, totalCourses, totalInstructors, totalCategories, totalLessons])

  const stats = [
    {
      label: 'Courses',
      value: counts.courses,
      suffix: '+',
      icon: '📚',
      color: 'from-primary-500/20 to-primary-600/20',
      borderColor: 'border-primary-500/30'
    },
    {
      label: 'Expert Instructors',
      value: counts.instructors,
      suffix: '+',
      icon: '👨‍🏫',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Categories',
      value: counts.categories,
      suffix: '',
      icon: '🏷️',
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Total Lessons',
      value: counts.lessons,
      suffix: '+',
      icon: '📖',
      color: 'from-amber-500/20 to-amber-600/20',
      borderColor: 'border-amber-500/30'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-xl p-4 text-center transform transition-all duration-500 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <span className="text-2xl mb-2 block">{stat.icon}</span>
          <div className="text-2xl lg:text-3xl font-bold text-white">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-navy-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}