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

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    {
      value: animatedValues.courses,
      label: 'Courses',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      value: animatedValues.lessons,
      label: 'Lessons',
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: animatedValues.instructors,
      label: 'Experts',
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card p-4 text-center group hover:scale-105 transition-transform duration-300"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </div>
          <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
            {stat.value}+
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}