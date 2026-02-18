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

  useEffect(() => {
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      setAnimatedCourses(Math.floor(totalCourses * easeOut))
      setAnimatedLessons(Math.floor(totalLessons * easeOut))
      setAnimatedInstructors(Math.floor(totalInstructors * easeOut))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedCourses(totalCourses)
        setAnimatedLessons(totalLessons)
        setAnimatedInstructors(totalInstructors)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalInstructors])

  const stats = [
    {
      icon: '📚',
      value: animatedCourses,
      label: 'Total Courses',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📖',
      value: animatedLessons,
      label: 'Video Lessons',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '👨‍🏫',
      value: animatedInstructors,
      label: 'Expert Instructors',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
          <div className="relative bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-xl p-4 text-center hover:border-navy-600 transition-colors">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <div className="text-2xl font-bold text-white tabular-nums">
              {stat.value}+
            </div>
            <div className="text-navy-400 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}