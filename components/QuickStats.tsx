'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Animate numbers counting up
    const duration = 1500 // 1.5 seconds
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease-out cubic function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(totalCourses * eased))
      setAnimatedLessons(Math.round(totalLessons * eased))
      setAnimatedInstructors(Math.round(totalInstructors * eased))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors])

  const stats = [
    {
      icon: '📚',
      value: animatedCourses,
      label: 'Courses Available',
      color: 'from-primary-500/20 to-primary-600/20',
      textColor: 'text-primary-400',
    },
    {
      icon: '📖',
      value: animatedLessons,
      label: 'Total Lessons',
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-400',
    },
    {
      icon: '👨‍🏫',
      value: animatedInstructors,
      label: 'Expert Instructors',
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-6 bg-gradient-to-br ${stat.color} transform transition-all duration-500 hover:scale-105 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <div className={`text-3xl font-bold ${stat.textColor}`}>
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