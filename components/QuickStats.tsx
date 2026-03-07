'use client'

import { useState, useEffect } from 'react'

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: string
  color: string
}

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

export default function QuickStats({ coursesCount, instructorsCount, categoriesCount }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    students: 0,
  })

  const stats: StatItem[] = [
    { label: 'Courses', value: coursesCount, suffix: '+', icon: '📚', color: 'from-primary-500 to-primary-600' },
    { label: 'Instructors', value: instructorsCount, suffix: '+', icon: '👨‍🏫', color: 'from-purple-500 to-purple-600' },
    { label: 'Categories', value: categoriesCount, suffix: '', icon: '🏷️', color: 'from-cyan-500 to-cyan-600' },
    { label: 'Students', value: 2500, suffix: '+', icon: '🎓', color: 'from-green-500 to-green-600' },
  ]

  useEffect(() => {
    // Animate numbers counting up
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        courses: Math.floor(coursesCount * easeOut),
        instructors: Math.floor(instructorsCount * easeOut),
        categories: Math.floor(categoriesCount * easeOut),
        students: Math.floor(2500 * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          courses: coursesCount,
          instructors: instructorsCount,
          categories: categoriesCount,
          students: 2500,
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount])

  const getAnimatedValue = (label: string): number => {
    switch (label) {
      case 'Courses': return animatedValues.courses
      case 'Instructors': return animatedValues.instructors
      case 'Categories': return animatedValues.categories
      case 'Students': return animatedValues.students
      default: return 0
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800 p-6 hover:border-navy-700 transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {getAnimatedValue(stat.label)}{stat.suffix}
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>

          {/* Decorative corner */}
          <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
        </div>
      ))}
    </div>
  )
}