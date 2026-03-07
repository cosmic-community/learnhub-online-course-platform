'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalHours: number
}

export default function LearningStats({
  totalCourses,
  totalLessons,
  totalInstructors,
  totalHours,
}: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    lessons: 0,
    instructors: 0,
    hours: 0,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        hours: Math.round(totalHours * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          courses: totalCourses,
          lessons: totalLessons,
          instructors: totalInstructors,
          hours: totalHours,
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors, totalHours])

  const stats = [
    {
      label: 'Courses',
      value: animatedValues.courses,
      suffix: '+',
      icon: '📚',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      label: 'Lessons',
      value: animatedValues.lessons,
      suffix: '+',
      icon: '📖',
      color: 'from-purple-500 to-pink-400',
    },
    {
      label: 'Expert Instructors',
      value: animatedValues.instructors,
      suffix: '',
      icon: '👨‍🏫',
      color: 'from-orange-500 to-yellow-400',
    },
    {
      label: 'Hours of Content',
      value: animatedValues.hours,
      suffix: '+',
      icon: '⏱️',
      color: 'from-green-500 to-emerald-400',
    },
  ]

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl" 
               style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
          <div className="relative bg-navy-900/60 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 hover:border-navy-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value.toLocaleString()}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}