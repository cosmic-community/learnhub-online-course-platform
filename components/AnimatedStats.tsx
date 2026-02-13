'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedNumberProps {
  value: number
  suffix?: string
  duration?: number
}

function AnimatedNumber({ value, suffix = '', duration = 2000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(easeOut * value))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {displayValue}{suffix}
    </div>
  )
}

interface Stat {
  value: number
  suffix: string
  label: string
  icon: string
  description: string
  color: string
}

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: AnimatedStatsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const stats: Stat[] = [
    {
      value: coursesCount,
      suffix: '+',
      label: 'Courses',
      icon: '📚',
      description: 'Expert-led courses covering the latest technologies',
      color: 'from-blue-500/20 to-blue-600/5'
    },
    {
      value: instructorsCount,
      suffix: '+',
      label: 'Expert Instructors',
      icon: '👨‍🏫',
      description: 'Industry professionals ready to guide your journey',
      color: 'from-purple-500/20 to-purple-600/5'
    },
    {
      value: lessonsCount,
      suffix: '+',
      label: 'Video Lessons',
      icon: '🎬',
      description: 'Hours of hands-on, practical content',
      color: 'from-green-500/20 to-green-600/5'
    },
    {
      value: categoriesCount,
      suffix: '',
      label: 'Categories',
      icon: '🏷️',
      description: 'Diverse topics from web dev to cloud computing',
      color: 'from-orange-500/20 to-orange-600/5'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-navy-700/50 p-6 transition-all duration-300 cursor-pointer ${
            hoveredIndex === index ? 'transform scale-105 shadow-xl shadow-primary-500/10' : ''
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 text-6xl opacity-10">
            {stat.icon}
          </div>
          
          <div className="relative">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
            
            {/* Hover description */}
            <div className={`mt-3 text-xs text-navy-300 transition-all duration-300 ${
              hoveredIndex === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
            } overflow-hidden`}>
              {stat.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}