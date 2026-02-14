'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  courses: number
  instructors: number
  categories: number
  totalHours: number
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const stepValue = value / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += stepValue
            if (current >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-3xl font-bold text-white">
      {displayValue}{suffix}
    </div>
  )
}

export default function AnimatedStats({ courses, instructors, categories, totalHours }: AnimatedStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      <div className="text-center p-4 rounded-xl bg-navy-900/50 backdrop-blur-sm border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
        <AnimatedNumber value={courses} suffix="+" />
        <div className="text-navy-400 text-sm mt-1">Courses</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/50 backdrop-blur-sm border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👨‍🏫</div>
        <AnimatedNumber value={instructors} suffix="+" />
        <div className="text-navy-400 text-sm mt-1">Instructors</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/50 backdrop-blur-sm border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
        <AnimatedNumber value={categories} />
        <div className="text-navy-400 text-sm mt-1">Categories</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/50 backdrop-blur-sm border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
        <AnimatedNumber value={totalHours} suffix="h" />
        <div className="text-navy-400 text-sm mt-1">Content</div>
      </div>
    </div>
  )
}