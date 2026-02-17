'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  courses: number
  instructors: number
  categories: number
  totalHours: number
  totalLessons: number
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
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
  }, [end, duration, isVisible])

  return { count, ref }
}

export default function AnimatedStats({ 
  courses, 
  instructors, 
  categories, 
  totalHours,
  totalLessons 
}: AnimatedStatsProps) {
  const coursesCounter = useCountUp(courses, 1500)
  const instructorsCounter = useCountUp(instructors, 1800)
  const categoriesCounter = useCountUp(categories, 1200)
  const hoursCounter = useCountUp(totalHours, 2000)
  const lessonsCounter = useCountUp(totalLessons, 1700)

  const stats = [
    {
      value: coursesCounter.count,
      label: 'Courses',
      icon: '📚',
      ref: coursesCounter.ref,
      suffix: '+'
    },
    {
      value: lessonsCounter.count,
      label: 'Lessons',
      icon: '📖',
      ref: lessonsCounter.ref,
      suffix: '+'
    },
    {
      value: hoursCounter.count,
      label: 'Hours of Content',
      icon: '⏱️',
      ref: hoursCounter.ref,
      suffix: '+'
    },
    {
      value: instructorsCounter.count,
      label: 'Expert Instructors',
      icon: '👨‍🏫',
      ref: instructorsCounter.ref,
      suffix: '+'
    },
    {
      value: categoriesCounter.count,
      label: 'Categories',
      icon: '🏷️',
      ref: categoriesCounter.ref,
      suffix: ''
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="text-center group cursor-default"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="stat-card p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1 tabular-nums">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-xs md:text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}