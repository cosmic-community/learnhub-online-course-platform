'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

function useCountAnimation(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true)
    }
  }, [startOnView])

  useEffect(() => {
    if (startOnView && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasStarted) {
            setHasStarted(true)
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(elementRef.current)
      return () => observer.disconnect()
    }
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { count, ref: elementRef }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  totalLessons 
}: AnimatedStatsProps) {
  const courses = useCountAnimation(coursesCount)
  const instructors = useCountAnimation(instructorsCount)
  const categories = useCountAnimation(categoriesCount)
  const hours = useCountAnimation(totalHours)
  const lessons = useCountAnimation(totalLessons)

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      ref: courses.ref 
    },
    { 
      value: lessons.count, 
      label: 'Lessons', 
      icon: '📖',
      suffix: '+',
      ref: lessons.ref 
    },
    { 
      value: hours.count, 
      label: 'Hours of Content', 
      icon: '⏱️',
      suffix: '+',
      ref: hours.ref 
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      ref: instructors.ref 
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      icon: '🏷️',
      suffix: '',
      ref: categories.ref 
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="text-center p-4 rounded-xl bg-navy-800/30 border border-navy-700/50 hover:border-primary-500/30 transition-all duration-300 hover:scale-105 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-xs sm:text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}