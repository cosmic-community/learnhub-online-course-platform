'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

interface StatItemProps {
  value: number
  label: string
  icon: string
  delay: number
}

function StatItem({ value, label, icon, delay }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    const animationTimer = setTimeout(() => {
      const duration = 1500
      const steps = 30
      const increment = value / steps
      let current = 0
      
      const counter = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(counter)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(counter)
    }, delay + 200)

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(animationTimer)
    }
  }, [value, delay])

  return (
    <div 
      className={`text-center transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {displayValue}+
      </div>
      <div className="text-navy-400 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      <StatItem value={coursesCount} label="Courses" icon="📚" delay={0} />
      <StatItem value={lessonsCount} label="Lessons" icon="📖" delay={150} />
      <StatItem value={instructorsCount} label="Instructors" icon="👨‍🏫" delay={300} />
      <StatItem value={categoriesCount} label="Categories" icon="🏷️" delay={450} />
    </div>
  )
}