'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0,
  })

  useEffect(() => {
    const duration = 1500 // Animation duration in ms
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedValues({
        courses: Math.floor(totalCourses * easeOutQuart),
        instructors: Math.floor(totalInstructors * easeOutQuart),
        categories: Math.floor(totalCategories * easeOutQuart),
        lessons: Math.floor(totalLessons * easeOutQuart),
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          courses: totalCourses,
          instructors: totalInstructors,
          categories: totalCategories,
          lessons: totalLessons,
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalCategories, totalLessons])

  const stats = [
    {
      label: 'Courses',
      value: animatedValues.courses,
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      href: '/courses',
    },
    {
      label: 'Lessons',
      value: animatedValues.lessons,
      icon: '📖',
      color: 'from-purple-500 to-pink-500',
      href: '/courses',
    },
    {
      label: 'Instructors',
      value: animatedValues.instructors,
      icon: '👨‍🏫',
      color: 'from-orange-500 to-red-500',
      href: '/instructors',
    },
    {
      label: 'Categories',
      value: animatedValues.categories,
      icon: '🏷️',
      color: 'from-green-500 to-emerald-500',
      href: '/categories',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="group relative overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800 p-6 transition-all duration-300 hover:border-navy-700 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1"
        >
          {/* Gradient background on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />
          
          <div className="relative">
            <span className="text-3xl mb-3 block">{stat.icon}</span>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}+
            </div>
            <div className="text-navy-400 text-sm group-hover:text-navy-300 transition-colors">
              {stat.label}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}