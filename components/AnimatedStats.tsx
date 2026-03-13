'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true)
    }
  }, [startOnView])

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount, 
  totalHours 
}: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const categories = useCountUp(categoriesCount)
  const hours = useCountUp(totalHours)

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      suffix: '+',
      icon: '📚',
      ref: courses.ref,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      suffix: '+',
      icon: '👨‍🏫',
      ref: instructors.ref,
      color: 'from-green-400 to-green-600'
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      suffix: '',
      icon: '🏷️',
      ref: categories.ref,
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: hours.count, 
      label: 'Hours of Content', 
      suffix: '+',
      icon: '⏱️',
      ref: hours.ref,
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-center p-6 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-navy-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/10">
            {/* Animated background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className={`text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-navy-400 text-sm">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}