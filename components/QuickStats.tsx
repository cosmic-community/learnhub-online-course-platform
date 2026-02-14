'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLessons: number
}

export default function QuickStats({ totalCourses, totalInstructors, totalCategories, totalLessons }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0,
  })

  useEffect(() => {
    const duration = 1500 // ms
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
        lessons: Math.round(totalLessons * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues({
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
    { value: animatedValues.courses, label: 'Courses', icon: '📚', color: 'from-primary-500 to-primary-600' },
    { value: animatedValues.lessons, label: 'Lessons', icon: '📖', color: 'from-blue-500 to-blue-600' },
    { value: animatedValues.instructors, label: 'Instructors', icon: '👨‍🏫', color: 'from-purple-500 to-purple-600' },
    { value: animatedValues.categories, label: 'Categories', icon: '🏷️', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card p-4 text-center group hover:scale-105 transition-transform duration-300"
        >
          <div className={`text-3xl mb-2 transition-transform group-hover:scale-125 duration-300`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stat.value}+
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}