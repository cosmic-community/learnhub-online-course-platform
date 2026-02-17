'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  lessonsCount: number
  instructorsCount: number
}

export default function QuickStats({ coursesCount, lessonsCount, instructorsCount }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)

  useEffect(() => {
    const duration = 1500 // Animation duration in ms
    const steps = 30
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(coursesCount * easeOut))
      setAnimatedLessons(Math.round(lessonsCount * easeOut))
      setAnimatedInstructors(Math.round(instructorsCount * easeOut))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, lessonsCount, instructorsCount])

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8">
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary-500/10 mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-2xl sm:text-3xl">📚</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
          {animatedCourses}+
        </div>
        <div className="text-navy-400 text-xs sm:text-sm mt-1">Premium Courses</div>
      </div>
      
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary-500/10 mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-2xl sm:text-3xl">🎬</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
          {animatedLessons}+
        </div>
        <div className="text-navy-400 text-xs sm:text-sm mt-1">Video Lessons</div>
      </div>
      
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary-500/10 mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-2xl sm:text-3xl">👨‍🏫</span>
        </div>
        <div className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
          {animatedInstructors}+
        </div>
        <div className="text-navy-400 text-xs sm:text-sm mt-1">Expert Instructors</div>
      </div>
    </div>
  )
}