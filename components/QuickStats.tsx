'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalLessons, totalCategories }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    categories: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        categories: Math.round(totalCategories * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          courses: totalCourses,
          lessons: totalLessons,
          categories: totalCategories,
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalCategories])

  const stats = [
    {
      icon: '📚',
      value: animatedValues.courses,
      label: 'Expert Courses',
      color: 'from-blue-500 to-blue-600',
      delay: '0ms',
    },
    {
      icon: '🎯',
      value: animatedValues.lessons,
      label: 'Video Lessons',
      color: 'from-purple-500 to-purple-600',
      delay: '100ms',
    },
    {
      icon: '🏷️',
      value: animatedValues.categories,
      label: 'Categories',
      color: 'from-green-500 to-green-600',
      delay: '200ms',
    },
    {
      icon: '⭐',
      value: 4.9,
      label: 'Average Rating',
      color: 'from-yellow-500 to-orange-500',
      delay: '300ms',
      isDecimal: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-5 group hover:scale-105 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: stat.delay }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {stat.icon}
            </span>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color} animate-pulse`} />
          </div>
          <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1`}>
            {stat.isDecimal ? stat.value.toFixed(1) : stat.value}
            {!stat.isDecimal && '+'}
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}