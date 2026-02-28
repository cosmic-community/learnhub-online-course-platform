'use client'

import { useState, useEffect, useRef } from 'react'

interface LearningStatsProps {
  coursesCount: number
  lessonsCount: number
  instructorsCount: number
  categoriesCount: number
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const increment = value / (duration / 16)
          
          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(start))
            }
          }, 16)
          
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className="text-3xl font-bold text-white">
      {displayValue}{suffix}
    </div>
  )
}

export default function LearningStats({ 
  coursesCount, 
  lessonsCount, 
  instructorsCount, 
  categoriesCount 
}: LearningStatsProps) {
  const stats = [
    { value: coursesCount, label: 'Courses', icon: '📚', suffix: '+' },
    { value: lessonsCount, label: 'Lessons', icon: '📖', suffix: '+' },
    { value: instructorsCount, label: 'Instructors', icon: '👨‍🏫', suffix: '+' },
    { value: categoriesCount, label: 'Categories', icon: '🏷️', suffix: '' },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="text-center group cursor-default"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-1">
              {stat.icon}
            </span>
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-navy-400 text-sm mt-1 group-hover:text-primary-400 transition-colors">
            {stat.label}
          </div>
        </div>
      ))}
    </>
  )
}