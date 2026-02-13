'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
  lessonCount: number
  totalHours: number
}

interface StatItemProps {
  value: number
  label: string
  icon: string
  suffix?: string
  delay?: number
}

function StatItem({ value, label, icon, suffix = '', delay = 0 }: StatItemProps) {
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
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timeout = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        setDisplayValue(Math.min(Math.round(stepValue * currentStep), value))
        
        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, value, delay])

  return (
    <div 
      ref={ref}
      className="text-center group cursor-default"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-navy-800/50 border border-navy-700 rounded-2xl p-4 group-hover:border-primary-500/50 transition-all duration-300 group-hover:scale-105">
          <span className="text-2xl block mb-1">{icon}</span>
          <div className="text-3xl font-bold text-white tabular-nums">
            {displayValue}{suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function AnimatedStats({ 
  courseCount, 
  instructorCount, 
  categoryCount,
  lessonCount,
  totalHours 
}: AnimatedStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
      <StatItem value={courseCount} label="Courses" icon="📚" suffix="+" delay={0} />
      <StatItem value={lessonCount} label="Lessons" icon="📖" suffix="+" delay={100} />
      <StatItem value={totalHours} label="Hours" icon="⏱️" suffix="h" delay={200} />
      <StatItem value={instructorCount} label="Instructors" icon="👨‍🏫" suffix="+" delay={300} />
      <StatItem value={categoryCount} label="Categories" icon="🏷️" delay={400} />
    </div>
  )
}