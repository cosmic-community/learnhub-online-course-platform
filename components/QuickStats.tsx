'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

export default function QuickStats({ coursesCount, instructorsCount, categoriesCount }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, instructors: 0, categories: 0 })

  useEffect(() => {
    setAnimated(true)
    
    // Animate counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.round(easeOut * coursesCount),
        instructors: Math.round(easeOut * instructorsCount),
        categories: Math.round(easeOut * categoriesCount)
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({ courses: coursesCount, instructors: instructorsCount, categories: categoriesCount })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount])

  const stats = [
    { 
      label: 'Courses', 
      value: counts.courses, 
      suffix: '+',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      description: 'Expert-led courses'
    },
    { 
      label: 'Instructors', 
      value: counts.instructors, 
      suffix: '+',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-pink-500',
      description: 'Industry professionals'
    },
    { 
      label: 'Categories', 
      value: counts.categories, 
      suffix: '',
      icon: '🏷️',
      color: 'from-green-500 to-emerald-500',
      description: 'Learning paths'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`relative group cursor-pointer transform transition-all duration-500 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="card p-5 text-center hover:scale-105 transition-transform duration-300">
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-white font-medium mt-1">{stat.label}</div>
              <div className="text-navy-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {stat.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}