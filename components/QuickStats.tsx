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
    
    // Animate counting up
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease out
      
      setCounts({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut)
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
      label: 'Courses', 
      value: counts.courses, 
      suffix: '+', 
      icon: '📚',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Lessons', 
      value: counts.lessons, 
      suffix: '+', 
      icon: '📖',
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      suffix: '', 
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Happy Learners', 
      value: Math.round(totalCourses * 127), 
      suffix: '+', 
      icon: '🎓',
      color: 'from-orange-500 to-orange-600'
    }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-4 text-center group hover:scale-105 transition-all duration-300 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">
            {stat.value.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}