'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [displayValues, setDisplayValues] = useState({ courses: 0, lessons: 0, instructors: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setDisplayValues({
        courses: Math.round(eased * totalCourses),
        lessons: Math.round(eased * totalLessons),
        instructors: Math.round(eased * totalInstructors),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animated, totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      label: 'Courses', 
      value: displayValues.courses, 
      suffix: '+',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Lessons', 
      value: displayValues.lessons, 
      suffix: '+',
      icon: '📖',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Expert Instructors', 
      value: displayValues.instructors, 
      suffix: '+',
      icon: '👨‍🏫',
      color: 'from-amber-500 to-orange-500'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-navy-600 hover:bg-navy-800/70"
          style={{
            animationDelay: `${index * 100}ms`,
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
          }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative flex items-center gap-4">
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
                <span className="text-lg font-semibold text-navy-400">{stat.suffix}</span>
              </div>
              <div className="text-sm text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}