'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentValue)
      countRef.current = currentValue

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  return { count, elementRef }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: AnimatedStatsProps) {
  const { count: courses, elementRef } = useCountUp(coursesCount)
  const { count: instructors } = useCountUp(instructorsCount)
  const { count: categories } = useCountUp(categoriesCount)
  const { count: lessons } = useCountUp(lessonsCount)

  return (
    <div 
      ref={elementRef}
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
    >
      <div className="text-center group">
        <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            {courses}+
          </span>
        </div>
        <div className="text-navy-400 text-sm group-hover:text-navy-300 transition-colors">Courses</div>
      </div>
      
      <div className="text-center group">
        <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            {lessons}+
          </span>
        </div>
        <div className="text-navy-400 text-sm group-hover:text-navy-300 transition-colors">Lessons</div>
      </div>
      
      <div className="text-center group">
        <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            {instructors}+
          </span>
        </div>
        <div className="text-navy-400 text-sm group-hover:text-navy-300 transition-colors">Instructors</div>
      </div>
      
      <div className="text-center group">
        <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            {categories}
          </span>
        </div>
        <div className="text-navy-400 text-sm group-hover:text-navy-300 transition-colors">Categories</div>
      </div>
    </div>
  )
}