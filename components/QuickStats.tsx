'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [displayedCourses, setDisplayedCourses] = useState(0)
  const [displayedLessons, setDisplayedLessons] = useState(0)
  const [displayedInstructors, setDisplayedInstructors] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplayedCourses(Math.round(totalCourses * easeOut))
      setDisplayedLessons(Math.round(totalLessons * easeOut))
      setDisplayedInstructors(Math.round(totalInstructors * easeOut))

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [animated, totalCourses, totalLessons, totalInstructors])

  const stats = [
    { label: 'Expert Courses', value: displayedCourses, suffix: '+', icon: '📚', color: 'from-blue-400 to-cyan-400' },
    { label: 'Video Lessons', value: displayedLessons, suffix: '+', icon: '🎬', color: 'from-purple-400 to-pink-400' },
    { label: 'Industry Experts', value: displayedInstructors, suffix: '', icon: '👨‍🏫', color: 'from-orange-400 to-yellow-400' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`card p-6 text-center group hover:scale-105 transition-all duration-300 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </div>
          <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}