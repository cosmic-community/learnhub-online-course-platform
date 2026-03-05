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
    
    // Animate counting up
    const duration = 2000
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
    { 
      icon: '📚', 
      value: counts.courses, 
      label: 'Courses Available',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: '📖', 
      value: counts.lessons, 
      label: 'Total Lessons',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: '👨‍🏫', 
      value: counts.instructors, 
      label: 'Expert Instructors',
      color: 'from-orange-500 to-yellow-500'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-6 text-center transform transition-all duration-700 ${
            animated 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1 tabular-nums">
            {stat.value.toLocaleString()}+
          </div>
          <div className="text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}