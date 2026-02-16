'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, start])
  
  return count
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  totalLessons 
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const courses = useCountUp(coursesCount, 1500, isVisible)
  const instructors = useCountUp(instructorsCount, 1500, isVisible)
  const hours = useCountUp(totalHours, 1800, isVisible)
  const lessons = useCountUp(totalLessons, 1600, isVisible)

  const stats = [
    { 
      value: courses, 
      suffix: '+', 
      label: 'Courses',
      icon: '📚',
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: instructors, 
      suffix: '+', 
      label: 'Expert Instructors',
      icon: '👨‍🏫',
      color: 'from-green-400 to-green-600'
    },
    { 
      value: hours, 
      suffix: '+', 
      label: 'Hours of Content',
      icon: '⏱️',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      value: lessons, 
      suffix: '+', 
      label: 'Video Lessons',
      icon: '🎬',
      color: 'from-purple-400 to-purple-600'
    },
  ]

  return (
    <div 
      ref={ref}
      className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
    >
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`relative text-center p-6 rounded-2xl bg-navy-900/30 border border-navy-800 backdrop-blur-sm transition-all duration-500 hover:border-navy-700 hover:bg-navy-900/50 group ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Glow effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
          
          <span className="text-2xl mb-2 block">{stat.icon}</span>
          <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}