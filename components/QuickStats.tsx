'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalHours: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalHours, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    hours: 0,
    lessons: 0,
    instructors: 0
  })

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    // Animate numbers
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCounts({
        courses: Math.round(totalCourses * easeOut),
        hours: Math.round(totalHours * easeOut),
        lessons: Math.round(totalLessons * easeOut),
        instructors: Math.round(totalInstructors * easeOut)
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts({
          courses: totalCourses,
          hours: totalHours,
          lessons: totalLessons,
          instructors: totalInstructors
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animated, totalCourses, totalHours, totalLessons, totalInstructors])

  const stats = [
    { 
      label: 'Courses Available', 
      value: counts.courses, 
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Hours of Content', 
      value: counts.hours, 
      icon: '⏱️',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Video Lessons', 
      value: counts.lessons, 
      icon: '🎬',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Expert Instructors', 
      value: counts.instructors, 
      icon: '👨‍🏫',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    },
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Platform Stats</h3>
          <p className="text-navy-400 text-sm">What&apos;s available for you to learn</p>
        </div>
        <div className="text-3xl animate-float">📊</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-4 transform transition-all duration-500 hover:scale-105`}
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}+
              </span>
            </div>
            <p className="text-navy-300 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Fun Fact */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-xl border border-primary-500/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-white font-medium mb-1">Did you know?</p>
            <p className="text-navy-300 text-sm">
              {totalHours > 20 
                ? `With ${totalHours}+ hours of content, you could learn something new every day for ${Math.round(totalHours / 0.5)} days!`
                : `Our instructors have combined experience of ${totalInstructors * 8}+ years in the industry!`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}