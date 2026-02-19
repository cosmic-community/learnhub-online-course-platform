'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

export default function QuickStats({ 
  totalCourses, 
  totalLessons, 
  totalInstructors,
  totalCategories 
}: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      setAnimatedInstructors(Math.round(totalInstructors * easeOut))
      setAnimatedCategories(Math.round(totalCategories * easeOut))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors, totalCategories])

  const stats = [
    {
      label: 'Courses',
      value: animatedCourses,
      icon: '📚',
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0ms'
    },
    {
      label: 'Lessons',
      value: animatedLessons,
      icon: '📖',
      gradient: 'from-purple-500 to-pink-500',
      delay: '100ms'
    },
    {
      label: 'Instructors',
      value: animatedInstructors,
      icon: '👨‍🏫',
      gradient: 'from-orange-500 to-red-500',
      delay: '200ms'
    },
    {
      label: 'Categories',
      value: animatedCategories,
      icon: '🏷️',
      gradient: 'from-green-500 to-emerald-500',
      delay: '300ms'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-4 text-center transform transition-all duration-700 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: stat.delay }}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3`}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}+
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}