'use client'

import { useEffect, useState } from 'react'

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
    
    // Animate counters
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    
    let step = 0
    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
      })
      
      if (step >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    { label: 'Courses', value: counts.courses, icon: '📚', color: 'from-primary-500 to-blue-500' },
    { label: 'Lessons', value: counts.lessons, icon: '📖', color: 'from-green-500 to-emerald-500' },
    { label: 'Experts', value: counts.instructors, icon: '👨‍🏫', color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl p-4 text-center transition-all duration-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          <div className="relative">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}+</div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}