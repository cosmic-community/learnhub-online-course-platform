'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  totalLessons
}: LearningStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers on mount
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(coursesCount * easeOut))
      setAnimatedInstructors(Math.round(instructorsCount * easeOut))
      setAnimatedCategories(Math.round(categoriesCount * easeOut))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount])

  return (
    <div className={`mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
        <div className="text-center group cursor-default">
          <div className="relative">
            <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {animatedCourses}+
            </div>
            <div className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              📚
            </div>
          </div>
          <div className="text-navy-400 text-sm">Courses</div>
        </div>
        <div className="text-center group cursor-default">
          <div className="relative">
            <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {animatedInstructors}+
            </div>
            <div className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              👨‍🏫
            </div>
          </div>
          <div className="text-navy-400 text-sm">Instructors</div>
        </div>
        <div className="text-center group cursor-default">
          <div className="relative">
            <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
              {animatedCategories}
            </div>
            <div className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              🏷️
            </div>
          </div>
          <div className="text-navy-400 text-sm">Categories</div>
        </div>
      </div>
    </div>
  )
}