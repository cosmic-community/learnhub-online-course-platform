'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  totalHours: number
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount,
  totalHours 
}: QuickStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`mt-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        <StatCard 
          value={coursesCount} 
          label="Courses" 
          icon="📚" 
          delay={0}
          suffix="+"
        />
        <StatCard 
          value={lessonsCount} 
          label="Lessons" 
          icon="📖" 
          delay={100}
          suffix="+"
        />
        <StatCard 
          value={totalHours} 
          label="Hours" 
          icon="⏱️" 
          delay={200}
          suffix="+"
        />
        <StatCard 
          value={instructorsCount} 
          label="Instructors" 
          icon="👨‍🏫" 
          delay={300}
          suffix="+"
        />
        <StatCard 
          value={categoriesCount} 
          label="Categories" 
          icon="🏷️" 
          delay={400}
          className="col-span-2 md:col-span-1"
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  value: number
  label: string
  icon: string
  delay: number
  suffix?: string
  className?: string
}

function StatCard({ value, label, icon, delay, suffix = '', className = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), delay)
    
    const animationTimer = setTimeout(() => {
      const duration = 1500
      const steps = 40
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
    }, delay + 300)
    
    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(animationTimer)
    }
  }, [value, delay])

  return (
    <div 
      className={`
        text-center p-4 rounded-2xl bg-navy-900/50 border border-navy-800
        transition-all duration-500
        hover:border-primary-500/30 hover:bg-navy-900/80
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold text-white">
        {displayValue}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}