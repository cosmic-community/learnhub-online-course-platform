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
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
        lessons: Math.round(totalLessons * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalCategories, totalLessons])

  const stats = [
    { 
      value: animatedValues.courses, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      suffix: '+',
    },
    { 
      value: animatedValues.lessons, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
      suffix: '+',
    },
    { 
      value: animatedValues.instructors, 
      label: 'Instructors', 
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-500',
      suffix: '+',
    },
    { 
      value: animatedValues.categories, 
      label: 'Categories', 
      icon: '🏷️',
      color: 'from-green-500 to-emerald-500',
      suffix: '',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-navy-900/50 rounded-xl p-6 border border-navy-800 hover:border-navy-700 transition-all duration-300 hover:scale-105 cursor-default overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-4xl font-bold text-white mb-1">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm font-medium">{stat.label}</div>
          </div>
          
          {/* Sparkle effect */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-lg animate-pulse">✨</span>
          </div>
        </div>
      ))}
    </div>
  )
}