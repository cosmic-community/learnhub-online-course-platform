'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalInstructors, totalCategories }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedInstructors(Math.round(totalInstructors * easeOut))
      setAnimatedCategories(Math.round(totalCategories * easeOut))

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedCourses(totalCourses)
        setAnimatedInstructors(totalInstructors)
        setAnimatedCategories(totalCategories)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalCategories])

  const stats = [
    { value: animatedCourses, label: 'Courses', icon: '📚', suffix: '+', color: 'from-blue-500 to-cyan-500' },
    { value: animatedInstructors, label: 'Instructors', icon: '👨‍🏫', suffix: '+', color: 'from-purple-500 to-pink-500' },
    { value: animatedCategories, label: 'Categories', icon: '🏷️', suffix: '', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`text-center transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-2xl opacity-20`} />
            <div className="relative">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-3xl font-bold text-white tabular-nums">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}