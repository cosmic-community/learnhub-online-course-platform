'use client'

import { useState, useEffect, useRef } from 'react'

interface StatProps {
  value: number
  label: string
  suffix?: string
}

function AnimatedStat({ value, label, suffix = '' }: StatProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateValue(0, value, 1500)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  const animateValue = (start: number, end: number, duration: number) => {
    const startTime = performance.now()
    
    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(start + (end - start) * easeOutQuart)
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }
    
    requestAnimationFrame(updateValue)
  }

  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-110">
        {displayValue}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}

interface AnimatedStatsProps {
  courses: number
  instructors: number
  categories: number
}

export default function AnimatedStats({ courses, instructors, categories }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      <AnimatedStat value={courses} label="Courses" suffix="+" />
      <AnimatedStat value={instructors} label="Expert Instructors" suffix="+" />
      <AnimatedStat value={categories} label="Categories" />
    </div>
  )
}