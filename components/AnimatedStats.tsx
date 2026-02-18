'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return
    
    const startTime = Date.now()
    const startValue = 0
    
    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(startValue + (end - startValue) * easeOutQuart)
      
      countRef.current = currentValue
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }
    
    requestAnimationFrame(updateCount)
  }, [end, duration, hasStarted])

  return { count, startCounting: () => setHasStarted(true), hasStarted }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const courses = useCountUp(coursesCount, 2000)
  const instructors = useCountUp(instructorsCount, 1800)
  const categories = useCountUp(categoriesCount, 1500)
  const lessons = useCountUp(lessonsCount, 2200)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isVisible) {
          setIsVisible(true)
          courses.startCounting()
          instructors.startCounting()
          categories.startCounting()
          lessons.startCounting()
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible, courses, instructors, categories, lessons])

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-primary-400 to-primary-600',
      delay: 0
    },
    { 
      value: lessons.count, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-blue-400 to-blue-600',
      delay: 100
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      color: 'from-purple-400 to-purple-600',
      delay: 200
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      icon: '🏷️',
      color: 'from-orange-400 to-orange-600',
      delay: 300
    },
  ]

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative group transition-all duration-500 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800 p-6 hover:border-navy-700 transition-all duration-300 hover:scale-105">
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            {/* Floating icon */}
            <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
              {stat.icon}
            </div>
            
            {/* Animated counter */}
            <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
              {stat.value}+
            </div>
            
            <div className="text-navy-400 text-sm font-medium">
              {stat.label}
            </div>
            
            {/* Sparkle effect on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-lg animate-pulse">✨</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}