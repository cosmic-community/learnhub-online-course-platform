'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  courseCount: number
  lessonCount: number
  categoryCount: number
}

export default function QuickStats({ courseCount, lessonCount, categoryCount }: QuickStatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      label: 'Courses Available', 
      value: courseCount, 
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    { 
      label: 'Total Lessons', 
      value: lessonCount, 
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
      delay: 100
    },
    { 
      label: 'Categories', 
      value: categoryCount, 
      icon: '🏷️',
      color: 'from-green-500 to-emerald-500',
      delay: 200
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-5 relative overflow-hidden group transform transition-all duration-500 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {stat.value}+
              </div>
              <div className="text-sm text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}