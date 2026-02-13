'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, lessons: 0, instructors: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!animated) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setCounts({
        courses: Math.round(totalCourses * eased),
        lessons: Math.round(totalLessons * eased),
        instructors: Math.round(totalInstructors * eased),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [animated, totalCourses, totalLessons, totalInstructors])

  const stats = [
    { 
      value: counts.courses, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-primary-500 to-primary-600',
      delay: 0
    },
    { 
      value: counts.lessons, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-yellow-500 to-orange-500',
      delay: 100
    },
    { 
      value: counts.instructors, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      color: 'from-pink-500 to-purple-500',
      delay: 200
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`group relative overflow-hidden bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-all duration-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
          
          {/* Icon */}
          <div className="relative z-10 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-white tabular-nums">
                {stat.value}+
              </div>
              <div className="text-navy-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          </div>

          {/* Animated particles on hover */}
          <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${stat.color} opacity-30`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${60 + (i % 2) * 20}%`,
                  animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}