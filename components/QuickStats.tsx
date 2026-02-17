'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ courses: 0, lessons: 0, instructors: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (animated) {
      // Animate numbers counting up
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setCounts({
          courses: Math.floor(totalCourses * easeOut),
          lessons: Math.floor(totalLessons * easeOut),
          instructors: Math.floor(totalInstructors * easeOut),
        })

        if (step >= steps) {
          clearInterval(timer)
          setCounts({ courses: totalCourses, lessons: totalLessons, instructors: totalInstructors })
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [animated, totalCourses, totalLessons, totalInstructors])

  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8">
      <div className={`
        text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-500/5 
        border border-primary-500/20 transition-all duration-700
        ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="text-3xl md:text-5xl font-bold text-primary-400 mb-1">
          {counts.courses}+
        </div>
        <div className="text-navy-400 text-sm md:text-base">Courses</div>
        <div className="mt-2 text-2xl">📚</div>
      </div>
      
      <div className={`
        text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 
        border border-purple-500/20 transition-all duration-700 delay-150
        ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="text-3xl md:text-5xl font-bold text-purple-400 mb-1">
          {counts.lessons}+
        </div>
        <div className="text-navy-400 text-sm md:text-base">Lessons</div>
        <div className="mt-2 text-2xl">📖</div>
      </div>
      
      <div className={`
        text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 
        border border-amber-500/20 transition-all duration-700 delay-300
        ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="text-3xl md:text-5xl font-bold text-amber-400 mb-1">
          {counts.instructors}+
        </div>
        <div className="text-navy-400 text-sm md:text-base">Instructors</div>
        <div className="mt-2 text-2xl">👨‍🏫</div>
      </div>
    </div>
  )
}