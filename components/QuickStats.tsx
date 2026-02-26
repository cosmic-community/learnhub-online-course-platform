'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

export default function QuickStats({ coursesCount, instructorsCount, categoriesCount }: QuickStatsProps) {
  const [counts, setCounts] = useState({ courses: 0, instructors: 0, categories: 0 })
  
  useEffect(() => {
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease-out function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCounts({
        courses: Math.round(coursesCount * easeOut),
        instructors: Math.round(instructorsCount * easeOut),
        categories: Math.round(categoriesCount * easeOut),
      })
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts({ courses: coursesCount, instructors: instructorsCount, categories: categoriesCount })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount])

  return (
    <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      <div className="text-center group cursor-default">
        <div className="text-3xl font-bold text-white transition-transform group-hover:scale-110">
          {counts.courses}+
        </div>
        <div className="text-navy-400 text-sm group-hover:text-primary-400 transition-colors">Courses</div>
      </div>
      <div className="text-center group cursor-default">
        <div className="text-3xl font-bold text-white transition-transform group-hover:scale-110">
          {counts.instructors}+
        </div>
        <div className="text-navy-400 text-sm group-hover:text-primary-400 transition-colors">Expert Instructors</div>
      </div>
      <div className="text-center group cursor-default">
        <div className="text-3xl font-bold text-white transition-transform group-hover:scale-110">
          {counts.categories}
        </div>
        <div className="text-navy-400 text-sm group-hover:text-primary-400 transition-colors">Categories</div>
      </div>
    </div>
  )
}