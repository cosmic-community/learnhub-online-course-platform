'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
}

export default function QuickStats({ totalCourses, totalInstructors, totalCategories }: QuickStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, instructors: 0, categories: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
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
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCounts({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        categories: Math.round(totalCategories * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts({ courses: totalCourses, instructors: totalInstructors, categories: totalCategories })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalInstructors, totalCategories])

  return (
    <div className={`mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {counts.courses}+
        </div>
        <div className="text-navy-400 text-sm">Courses</div>
      </div>
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {counts.instructors}+
        </div>
        <div className="text-navy-400 text-sm">Instructors</div>
      </div>
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {counts.categories}
        </div>
        <div className="text-navy-400 text-sm">Categories</div>
      </div>
    </div>
  )
}