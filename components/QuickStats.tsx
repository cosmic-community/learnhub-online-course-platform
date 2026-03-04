'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      label: 'Total Courses',
      value: totalCourses,
      icon: '📚',
      color: 'from-blue-400 to-blue-600',
      delay: 0
    },
    { 
      label: 'Video Lessons',
      value: totalLessons,
      icon: '🎬',
      color: 'from-purple-400 to-purple-600',
      delay: 100
    },
    { 
      label: 'Expert Instructors',
      value: totalInstructors,
      icon: '👨‍🏫',
      color: 'from-green-400 to-green-600',
      delay: 200
    },
    { 
      label: 'Hours of Content',
      value: totalLessons * 0.5, // Estimate 30 mins per lesson
      icon: '⏱️',
      color: 'from-orange-400 to-orange-600',
      delay: 300,
      suffix: '+'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-4 text-center transform transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {Math.floor(stat.value)}{stat.suffix || ''}
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}