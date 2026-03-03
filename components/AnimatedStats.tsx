'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

function useCountUp(end: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const timer = setTimeout(() => {
      let startTime: number | null = null
      const startValue = 0

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
        
        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [hasStarted, end, duration, delay])

  return { count, ref }
}

export default function AnimatedStats({ coursesCount, instructorsCount, categoriesCount }: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount, 1500, 0)
  const instructors = useCountUp(instructorsCount, 1500, 200)
  const categories = useCountUp(categoriesCount, 1500, 400)

  const stats = [
    { 
      label: 'Courses', 
      value: courses.count, 
      ref: courses.ref,
      icon: '📚',
      suffix: '+',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      label: 'Instructors', 
      value: instructors.count, 
      ref: instructors.ref,
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-green-400 to-green-600'
    },
    { 
      label: 'Categories', 
      value: categories.count, 
      ref: categories.ref,
      icon: '🏷️',
      suffix: '',
      color: 'from-purple-400 to-purple-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="text-center group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" 
                 style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
            <div className="text-2xl sm:text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}