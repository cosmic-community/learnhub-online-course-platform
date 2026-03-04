'use client'

import { useEffect, useState, useRef } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalLessons: number
  totalHours: number
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="text-3xl font-bold text-white tabular-nums">
      {displayValue}{suffix}
    </div>
  )
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalLessons,
  totalHours 
}: QuickStatsProps) {
  const stats = [
    { value: coursesCount, suffix: '+', label: 'Courses', icon: '📚', color: 'from-blue-500 to-blue-600' },
    { value: totalLessons, suffix: '+', label: 'Lessons', icon: '📖', color: 'from-purple-500 to-purple-600' },
    { value: totalHours, suffix: 'h', label: 'Content', icon: '⏱️', color: 'from-green-500 to-green-600' },
    { value: instructorsCount, suffix: '+', label: 'Experts', icon: '👨‍🏫', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center
            hover:border-navy-700 hover:bg-navy-900/70 transition-all duration-300
            animate-fade-in-up"
          style={{ animationDelay: `${500 + index * 100}ms` }}
        >
          {/* Gradient glow on hover */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}