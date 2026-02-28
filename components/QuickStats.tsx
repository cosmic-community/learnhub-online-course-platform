'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  categories: number
}

interface StatItemProps {
  icon: string
  label: string
  value: number
  suffix?: string
  color: string
  delay: number
}

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])
  
  return <span>{count}</span>
}

function StatItem({ icon, label, value, suffix = '', color, delay }: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <div 
      className={`
        flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 border border-navy-700/50
        transition-all duration-500 hover:border-navy-600 hover:bg-navy-800
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">
          <AnimatedCounter value={value} />
          {suffix}
        </div>
        <div className="text-navy-400 text-sm">{label}</div>
      </div>
    </div>
  )
}

export default function QuickStats({ totalCourses, totalLessons, totalHours, categories }: QuickStatsProps) {
  const stats = [
    { icon: '📚', label: 'Total Courses', value: totalCourses, color: 'bg-blue-500/20' },
    { icon: '📖', label: 'Total Lessons', value: totalLessons, color: 'bg-green-500/20' },
    { icon: '⏱️', label: 'Hours of Content', value: totalHours, suffix: '+', color: 'bg-purple-500/20' },
    { icon: '🏷️', label: 'Categories', value: categories, color: 'bg-orange-500/20' },
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Platform Stats
          </h3>
          <p className="text-navy-400 text-sm">Our growing library of content</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <StatItem
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            color={stat.color}
            delay={index * 100}
          />
        ))}
      </div>
      
      {/* Motivational footer */}
      <div className="mt-4 p-3 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-lg border border-primary-500/20">
        <p className="text-primary-300 text-sm text-center flex items-center justify-center gap-2">
          <span>🌟</span>
          <span>New content added every week!</span>
        </p>
      </div>
    </div>
  )
}