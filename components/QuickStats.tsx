'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  categories: number
}

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: string
  color: string
}

export default function QuickStats({ totalCourses, totalLessons, totalHours, categories }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    lessons: 0,
    hours: 0,
    categories: 0
  })

  useEffect(() => {
    setAnimated(true)
    
    // Animate counters
    const duration = 2000
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
        hours: Math.round(totalHours * easeOut),
        categories: Math.round(categories * easeOut)
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          lessons: totalLessons,
          hours: totalHours,
          categories: categories
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalHours, categories])

  const stats: StatItem[] = [
    { label: 'Courses', value: counts.courses, suffix: '+', icon: '📚', color: 'from-blue-500 to-cyan-500' },
    { label: 'Lessons', value: counts.lessons, suffix: '+', icon: '📖', color: 'from-purple-500 to-pink-500' },
    { label: 'Hours', value: counts.hours, suffix: 'h', icon: '⏱️', color: 'from-green-500 to-emerald-500' },
    { label: 'Categories', value: counts.categories, suffix: '', icon: '🏷️', color: 'from-orange-500 to-yellow-500' },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <span className="text-2xl">📊</span>
        Platform Overview
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`bg-navy-800/50 rounded-xl p-4 border border-navy-700 hover:border-navy-600 transition-all duration-300 group cursor-default ${
              animated ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-navy-400 text-sm">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Fun fact */}
      <div className="mt-6 pt-4 border-t border-navy-700">
        <div className="flex items-start gap-3 text-sm">
          <span className="text-xl">💡</span>
          <p className="text-navy-300">
            <span className="text-white font-medium">Did you know?</span> Our instructors have combined experience of over 50+ years in the industry!
          </p>
        </div>
      </div>
    </div>
  )
}