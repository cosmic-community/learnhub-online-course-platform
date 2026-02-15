'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  className?: string
}

export default function QuickStats({ 
  totalCourses, 
  totalLessons, 
  totalInstructors,
  className = '' 
}: QuickStatsProps) {
  const [viewedCourses, setViewedCourses] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const viewed = JSON.parse(localStorage.getItem('learnhub-viewed-courses') || '[]')
    const completed = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    setViewedCourses(viewed)
    setCompletedLessons(completed)
    setIsLoaded(true)
  }, [])

  const stats = [
    {
      icon: '📚',
      label: 'Courses Explored',
      value: viewedCourses.length,
      total: totalCourses,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: '📖',
      label: 'Lessons Available',
      value: completedLessons.length,
      total: totalLessons,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: '👨‍🏫',
      label: 'Expert Instructors',
      value: totalInstructors,
      total: totalInstructors,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ]

  if (!isLoaded) {
    return (
      <div className={`grid grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="card p-4 h-24 bg-navy-800/50"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card p-4 group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value === stat.total ? stat.total : `${stat.value}/${stat.total}`}
              </div>
              <div className="text-xs text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}