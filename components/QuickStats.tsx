'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalLessons, totalCategories }: QuickStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({ courses: 0, lessons: 0, categories: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers counting up
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        categories: Math.round(totalCategories * easeOut),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalCategories])

  const stats = [
    {
      label: 'Courses Available',
      value: animatedValues.courses,
      suffix: '+',
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      href: '/courses',
    },
    {
      label: 'Video Lessons',
      value: animatedValues.lessons,
      suffix: '+',
      icon: '🎬',
      color: 'from-purple-500 to-purple-600',
      href: '/courses',
    },
    {
      label: 'Categories',
      value: animatedValues.categories,
      suffix: '',
      icon: '🏷️',
      color: 'from-green-500 to-green-600',
      href: '/categories',
    },
  ]

  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {stats.map((stat, index) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="group card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}