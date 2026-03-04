'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedNumberProps {
  end: number
  duration?: number
  suffix?: string
}

function AnimatedNumber({ end, duration = 1500, suffix = '' }: AnimatedNumberProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [end, duration, isVisible])

  return (
    <span ref={countRef} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

export default function AnimatedStats({ coursesCount, instructorsCount, categoriesCount }: AnimatedStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          <AnimatedNumber end={coursesCount} suffix="+" />
        </div>
        <div className="text-navy-400 text-sm">Courses</div>
        <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          <AnimatedNumber end={instructorsCount} suffix="+" />
        </div>
        <div className="text-navy-400 text-sm">Instructors</div>
        <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
      <div className="text-center group">
        <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
          <AnimatedNumber end={categoriesCount} />
        </div>
        <div className="text-navy-400 text-sm">Categories</div>
        <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
    </div>
  )
}