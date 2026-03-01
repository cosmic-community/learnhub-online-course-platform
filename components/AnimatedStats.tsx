'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [startOnView, hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function AnimatedStats({ coursesCount, instructorsCount, categoriesCount, totalHours }: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount, 2000)
  const instructors = useCountUp(instructorsCount, 2000)
  const categories = useCountUp(categoriesCount, 1500)
  const hours = useCountUp(totalHours, 2500)

  const stats = [
    { 
      label: 'Courses', 
      value: courses.count, 
      suffix: '+', 
      ref: courses.ref,
      icon: '📚',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      label: 'Expert Instructors', 
      value: instructors.count, 
      suffix: '+', 
      ref: instructors.ref,
      icon: '👨‍🏫',
      color: 'from-green-400 to-green-600'
    },
    { 
      label: 'Categories', 
      value: categories.count, 
      suffix: '', 
      ref: categories.ref,
      icon: '🏷️',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      label: 'Hours of Content', 
      value: hours.count, 
      suffix: '+', 
      ref: hours.ref,
      icon: '⏱️',
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
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
               style={{ background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
          
          <div className="bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center hover:border-navy-700 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}