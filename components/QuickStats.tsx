'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors])

  const stats = [
    {
      label: 'Courses',
      value: animatedValues.courses,
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Lessons',
      value: animatedValues.lessons,
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Expert Instructors',
      value: animatedValues.instructors,
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
          <div className="relative bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-6 text-center hover:border-navy-600 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}+
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}