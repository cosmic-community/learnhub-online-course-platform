'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) {
      animateCount()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCount()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, hasAnimated, startOnView])

  const animateCount = () => {
    const startTime = performance.now()
    const startValue = 0

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }

  return { count, elementRef }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount, 2000)
  const instructors = useCountUp(instructorsCount, 2000)
  const categories = useCountUp(categoriesCount, 1500)
  const lessons = useCountUp(lessonsCount, 2500)

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      suffix: '+', 
      ref: courses.elementRef,
      icon: '📚',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: lessons.count, 
      label: 'Lessons', 
      suffix: '+', 
      ref: lessons.elementRef,
      icon: '📖',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      suffix: '+', 
      ref: instructors.elementRef,
      icon: '👨‍🏫',
      color: 'from-green-400 to-green-600'
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      suffix: '', 
      ref: categories.elementRef,
      icon: '🏷️',
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-center p-4 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-navy-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10">
            {/* Icon with gradient background */}
            <div className="mb-2 text-2xl">{stat.icon}</div>
            
            {/* Animated number */}
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}{stat.suffix}
              </span>
            </div>
            
            {/* Label */}
            <div className="text-navy-400 text-sm font-medium">{stat.label}</div>
            
            {/* Subtle glow effect on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl`} />
          </div>
        </div>
      ))}
    </div>
  )
}