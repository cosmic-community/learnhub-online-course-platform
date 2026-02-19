'use client'

import { useState, useEffect } from 'react'

interface QuickStat {
  label: string
  value: string | number
  icon: string
  color: string
  description: string
}

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function QuickStats({ coursesCount, instructorsCount, categoriesCount, lessonsCount }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues({
        courses: Math.round(coursesCount * easeOut),
        instructors: Math.round(instructorsCount * easeOut),
        categories: Math.round(categoriesCount * easeOut),
        lessons: Math.round(lessonsCount * easeOut),
      })
      
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount, lessonsCount])

  const stats: QuickStat[] = [
    {
      label: 'Courses',
      value: animatedValues.courses,
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      description: 'Ready to explore',
    },
    {
      label: 'Expert Instructors',
      value: animatedValues.instructors,
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600',
      description: 'Industry professionals',
    },
    {
      label: 'Categories',
      value: animatedValues.categories,
      icon: '🏷️',
      color: 'from-green-500 to-green-600',
      description: 'Topics to master',
    },
    {
      label: 'Lessons',
      value: animatedValues.lessons,
      icon: '📖',
      color: 'from-orange-500 to-orange-600',
      description: 'Hours of content',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative group cursor-default transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="card p-5 text-center hover:scale-105 transition-transform duration-300">
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
            
            <div className="relative">
              <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </span>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}+</div>
              <div className="text-navy-300 font-medium">{stat.label}</div>
              <div className="text-navy-500 text-xs mt-1">{stat.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}