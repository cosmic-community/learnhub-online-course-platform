'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLessons: number
}

export default function QuickStats({ 
  totalCourses, 
  totalInstructors, 
  totalCategories,
  totalLessons 
}: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { value: totalCourses, label: 'Courses', icon: '📚', color: 'from-blue-500 to-cyan-500' },
    { value: totalLessons, label: 'Lessons', icon: '📖', color: 'from-purple-500 to-pink-500' },
    { value: totalInstructors, label: 'Instructors', icon: '👨‍🏫', color: 'from-amber-500 to-orange-500' },
    { value: totalCategories, label: 'Categories', icon: '🏷️', color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            relative overflow-hidden rounded-2xl p-6 text-center
            bg-gradient-to-br ${stat.color} bg-opacity-10
            border border-white/10
            transform transition-all duration-700 ease-out
            ${animated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Background glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          
          <div className="relative z-10">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <div className="text-3xl font-bold text-white mb-1">
              {animated ? stat.value : 0}+
            </div>
            <div className="text-white/70 text-sm font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}