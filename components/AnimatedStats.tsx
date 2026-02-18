'use client'

import { useEffect, useRef, useState } from 'react'

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
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const categories = useCountUp(categoriesCount)
  const hours = useCountUp(totalHours)
  const lessons = useCountUp(totalLessons)

  const stats = [
    { 
      label: 'Courses', 
      value: courses.count, 
      ref: courses.ref, 
      suffix: '+',
      icon: '📚',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      label: 'Instructors', 
      value: instructors.count, 
      ref: instructors.ref, 
      suffix: '+',
      icon: '👨‍🏫',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      label: 'Lessons', 
      value: lessons.count, 
      ref: lessons.ref, 
      suffix: '+',
      icon: '📖',
      color: 'from-green-400 to-green-600'
    },
    { 
      label: 'Hours of Content', 
      value: hours.count, 
      ref: hours.ref, 
      suffix: '+',
      icon: '⏱️',
      color: 'from-orange-400 to-orange-600'
    },
    { 
      label: 'Categories', 
      value: categories.count, 
      ref: categories.ref, 
      suffix: '',
      icon: '🏷️',
      color: 'from-pink-400 to-pink-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
               style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
          
          <div className="bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-4 text-center hover:border-navy-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/10">
            <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </span>
            <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-xs md:text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}