'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors, totalCategories }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
    categories: 0,
  })

  useEffect(() => {
    setAnimated(true)
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
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
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
      description: 'Expert-led courses'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      icon: '📖', 
      color: 'from-purple-500 to-pink-500',
      description: 'Hours of content'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫', 
      color: 'from-orange-500 to-red-500',
      description: 'Industry experts'
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      icon: '🏷️', 
      color: 'from-green-500 to-emerald-500',
      description: 'Learning paths'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-5 transform transition-all duration-500 hover:scale-105 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
              {stat.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white tabular-nums">
                {stat.value}+
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-white">{stat.label}</div>
            <div className="text-xs text-navy-400">{stat.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}