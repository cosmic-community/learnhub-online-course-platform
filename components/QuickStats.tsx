'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, lessons: 0, instructors: 0 })

  useEffect(() => {
    setAnimated(true)
    
    // Animate counts
    const duration = 1500
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.floor(totalCourses * easeOut),
        lessons: Math.floor(totalLessons * easeOut),
        instructors: Math.floor(totalInstructors * easeOut),
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({ courses: totalCourses, lessons: totalLessons, instructors: totalInstructors })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    { label: 'Courses', value: counts.courses, icon: '📚', color: 'from-blue-400 to-blue-600' },
    { label: 'Lessons', value: counts.lessons, icon: '📖', color: 'from-green-400 to-green-600' },
    { label: 'Instructors', value: counts.instructors, icon: '👨‍🏫', color: 'from-purple-400 to-purple-600' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-4 transition-all duration-500 hover:scale-105 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="absolute top-2 right-2 text-3xl opacity-30">{stat.icon}</div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-white">{stat.value}+</div>
            <div className="text-sm text-white/80">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}