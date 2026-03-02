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
    const duration = 1500
    const steps = 60
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
      value: counts.courses, 
      label: 'Expert Courses', 
      emoji: '📚',
      color: 'from-primary-500 to-blue-500',
      description: 'Curated by professionals'
    },
    { 
      value: counts.lessons, 
      label: 'Video Lessons', 
      emoji: '🎬',
      color: 'from-green-500 to-emerald-500',
      description: 'Hours of content'
    },
    { 
      value: counts.instructors, 
      label: 'Instructors', 
      emoji: '👨‍🏫',
      color: 'from-purple-500 to-pink-500',
      description: 'Industry experts'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-6 text-center hover-lift hover-glow transition-all duration-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
            {stat.emoji}
          </div>
          <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}+
          </div>
          <div className="text-white font-semibold mb-1">{stat.label}</div>
          <div className="text-navy-400 text-sm">{stat.description}</div>
        </div>
      ))}
    </div>
  )
}