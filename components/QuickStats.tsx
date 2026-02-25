'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalLessons, totalCategories }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Start animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out cubic for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(totalCourses * eased))
      setAnimatedLessons(Math.round(totalLessons * eased))
      setAnimatedCategories(Math.round(totalCategories * eased))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalCategories])

  const stats = [
    { 
      value: animatedCourses, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-primary-500 to-cyan-400'
    },
    { 
      value: animatedLessons, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-purple-500 to-pink-400'
    },
    { 
      value: animatedCategories, 
      label: 'Categories', 
      icon: '🏷️',
      color: 'from-amber-500 to-orange-400'
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`relative overflow-hidden rounded-xl p-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
          
          <div className="relative text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {stat.value}+
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}