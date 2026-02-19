'use client'

import { useState, useEffect } from 'react'

interface StatItem {
  icon: string
  label: string
  value: number
  suffix?: string
  color: string
}

export default function QuickStats() {
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0])
  const [isVisible, setIsVisible] = useState(false)

  const stats: StatItem[] = [
    { icon: '📚', label: 'Courses Started', value: 4, color: 'text-blue-400' },
    { icon: '✅', label: 'Lessons Completed', value: 23, color: 'text-green-400' },
    { icon: '⏱️', label: 'Hours Learned', value: 12, suffix: 'h', color: 'text-purple-400' },
    { icon: '⭐', label: 'Certificates', value: 2, color: 'text-yellow-400' }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // Animate numbers counting up
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues(stats.map(stat => Math.round(stat.value * easedProgress)))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-5 text-center group hover:scale-105 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
            {stat.icon}
          </div>
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {animatedValues[index]}{stat.suffix || ''}
          </div>
          <div className="text-sm text-navy-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}