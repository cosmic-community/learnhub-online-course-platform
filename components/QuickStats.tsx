'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [visitCount, setVisitCount] = useState(0)
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
    visits: 0
  })

  useEffect(() => {
    // Track visit count
    const visits = parseInt(localStorage.getItem('learnhub_visits') || '0', 10) + 1
    localStorage.setItem('learnhub_visits', visits.toString())
    setVisitCount(visits)

    // Animate numbers
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setAnimatedValues({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
        visits: Math.round(visits * eased)
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    { label: 'Courses', value: animatedValues.courses, icon: '📚', color: 'from-primary-500 to-primary-600' },
    { label: 'Lessons', value: animatedValues.lessons, icon: '📖', color: 'from-amber-500 to-orange-500' },
    { label: 'Instructors', value: animatedValues.instructors, icon: '👨‍🏫', color: 'from-purple-500 to-pink-500' },
    { label: 'Your Visits', value: animatedValues.visits, icon: '👋', color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card p-4 group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}