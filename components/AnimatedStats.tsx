'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
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

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function AnimatedStats({ coursesCount, instructorsCount, categoriesCount }: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount, 2000)
  const instructors = useCountUp(instructorsCount, 2000)
  const categories = useCountUp(categoriesCount, 1500)
  const students = useCountUp(2847, 2500) // Simulated student count

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      icon: '📚',
      ref: courses.ref,
      suffix: '+'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      ref: instructors.ref,
      suffix: '+'
    },
    { 
      value: students.count, 
      label: 'Students', 
      icon: '🎓',
      ref: students.ref,
      suffix: '+'
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      icon: '🏷️',
      ref: categories.ref,
      suffix: ''
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          ref={stat.ref}
          className="text-center group animate-fade-in-up"
          style={{ animationDelay: `${index * 100 + 300}ms` }}
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-white tabular-nums">
            {stat.value.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}