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
        if (entries[0]?.isIntersecting && !hasStarted) {
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
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
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
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const categories = useCountUp(categoriesCount)
  const hours = useCountUp(totalHours)
  const lessons = useCountUp(totalLessons)

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      icon: '📚', 
      ref: courses.ref,
      suffix: '+',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: lessons.count, 
      label: 'Lessons', 
      icon: '📖', 
      ref: lessons.ref,
      suffix: '+',
      color: 'from-green-400 to-green-600'
    },
    { 
      value: hours.count, 
      label: 'Hours of Content', 
      icon: '⏱️', 
      ref: hours.ref,
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫', 
      ref: instructors.ref,
      suffix: '+',
      color: 'from-orange-400 to-orange-600'
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      icon: '🏷️', 
      ref: categories.ref,
      suffix: '',
      color: 'from-pink-400 to-pink-600'
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
          <div className="relative">
            <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}