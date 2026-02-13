'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function QuickStats({ coursesCount, instructorsCount, categoriesCount, lessonsCount }: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true)
  }, [])

  const stats = [
    { label: 'Courses', value: coursesCount, icon: '📚', suffix: '+' },
    { label: 'Instructors', value: instructorsCount, icon: '👨‍🏫', suffix: '+' },
    { label: 'Categories', value: categoriesCount, icon: '🏷️', suffix: '' },
    { label: 'Lessons', value: lessonsCount, icon: '📖', suffix: '+' },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="text-center group cursor-default"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative inline-block mb-2">
            <span className="text-4xl group-hover:scale-125 transition-transform duration-300 inline-block">
              {stat.icon}
            </span>
            <div className="absolute -inset-2 bg-primary-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </div>
          <div className={`text-3xl font-bold text-white transition-all duration-1000 ${animated ? 'opacity-100' : 'opacity-0'}`}>
            <AnimatedNumber value={stat.value} animated={animated} />
            {stat.suffix}
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ value, animated }: { value: number; animated: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!animated) return

    const duration = 1500
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setDisplayValue(current)

      if (step >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, animated])

  return <span>{displayValue}</span>
}