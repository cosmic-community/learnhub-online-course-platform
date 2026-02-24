'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
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
  totalHours,
  totalLessons
}: AnimatedStatsProps) {
  const { count: courses, ref: coursesRef } = useCountUp(coursesCount)
  const { count: instructors, ref: instructorsRef } = useCountUp(instructorsCount)
  const { count: hours, ref: hoursRef } = useCountUp(totalHours)
  const { count: lessons, ref: lessonsRef } = useCountUp(totalLessons)

  const stats = [
    { 
      label: 'Courses', 
      value: courses, 
      suffix: '+',
      ref: coursesRef,
      icon: '📚',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      label: 'Expert Instructors', 
      value: instructors, 
      suffix: '+',
      ref: instructorsRef,
      icon: '👨‍🏫',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      label: 'Hours of Content', 
      value: hours, 
      suffix: '+',
      ref: hoursRef,
      icon: '⏱️',
      color: 'from-green-400 to-green-600'
    },
    { 
      label: 'Video Lessons', 
      value: lessons, 
      suffix: '+',
      ref: lessonsRef,
      icon: '🎬',
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="group relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center hover:border-navy-700 transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}