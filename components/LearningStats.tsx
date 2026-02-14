'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningStats({ totalCourses, totalLessons, totalHours }: LearningStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedHours, setAnimatedHours] = useState(0)

  useEffect(() => {
    // Animate numbers on mount
    const duration = 1500
    const steps = 60
    const courseStep = totalCourses / steps
    const lessonStep = totalLessons / steps
    const hourStep = totalHours / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setAnimatedCourses(Math.min(Math.round(courseStep * currentStep), totalCourses))
      setAnimatedLessons(Math.min(Math.round(lessonStep * currentStep), totalLessons))
      setAnimatedHours(Math.min(Math.round(hourStep * currentStep), totalHours))

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [totalCourses, totalLessons, totalHours])

  const stats = [
    {
      icon: '📚',
      value: animatedCourses,
      suffix: '+',
      label: 'Courses Available',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: '📖',
      value: animatedLessons,
      suffix: '+',
      label: 'Total Lessons',
      color: 'from-primary-500 to-emerald-400',
    },
    {
      icon: '⏱️',
      value: animatedHours,
      suffix: 'h+',
      label: 'Learning Content',
      color: 'from-purple-500 to-pink-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card p-6 group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div>
              <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-navy-400">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}