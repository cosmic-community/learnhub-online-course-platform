'use client'

import { useEffect, useState, useRef } from 'react'

interface QuickStatsProps {
  coursesCount: number
  lessonsCount: number
  hoursCount: number
  instructorsCount: number
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
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
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
      {displayValue}{suffix}
    </div>
  )
}

export default function QuickStats({ coursesCount, lessonsCount, hoursCount, instructorsCount }: QuickStatsProps) {
  const stats = [
    { label: 'Expert-Led Courses', value: coursesCount, suffix: '+', icon: '📚', description: 'Curated curriculum' },
    { label: 'Video Lessons', value: lessonsCount, suffix: '+', icon: '🎬', description: 'Hands-on tutorials' },
    { label: 'Hours of Content', value: hoursCount, suffix: '+', icon: '⏱️', description: 'Learn at your pace' },
    { label: 'Industry Experts', value: instructorsCount, suffix: '+', icon: '👨‍🏫', description: 'Real-world experience' },
  ]

  return (
    <div className="relative">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Everything You Need to 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> Level Up</span>
        </h2>
        <p className="text-navy-400">Join our growing community of learners</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="relative group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card p-6 text-center h-full hover:border-primary-500/30 transition-all duration-300 hover:scale-105">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                <div className="text-white font-medium mt-2">{stat.label}</div>
                <div className="text-navy-500 text-sm mt-1">{stat.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}