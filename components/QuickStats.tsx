'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)

  useEffect(() => {
    // Animate numbers on mount
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.floor(totalCourses * eased))
      setAnimatedLessons(Math.floor(totalLessons * eased))
      setAnimatedInstructors(Math.floor(totalInstructors * eased))

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedCourses(totalCourses)
        setAnimatedLessons(totalLessons)
        setAnimatedInstructors(totalInstructors)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [totalCourses, totalLessons, totalInstructors])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Courses */}
      <div className="card p-6 group hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{animatedCourses}+</div>
            <div className="text-navy-400 text-sm">Premium Courses</div>
          </div>
        </div>
        <div className="mt-4 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Lessons */}
      <div className="card p-6 group hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">📖</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{animatedLessons}+</div>
            <div className="text-navy-400 text-sm">Video Lessons</div>
          </div>
        </div>
        <div className="mt-4 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Instructors */}
      <div className="card p-6 group hover:scale-105 transition-transform duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{animatedInstructors}+</div>
            <div className="text-navy-400 text-sm">Expert Instructors</div>
          </div>
        </div>
        <div className="mt-4 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}