'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  totalHours: number
}

function useCountAnimation(end: number, duration: number = 2000, startOnView: boolean = true) {
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
      (entries) => {
        if (entries[0]?.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
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

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount,
  totalHours 
}: AnimatedStatsProps) {
  const courses = useCountAnimation(coursesCount, 2000)
  const instructors = useCountAnimation(instructorsCount, 2000)
  const lessons = useCountAnimation(lessonsCount, 2500)
  const hours = useCountAnimation(totalHours, 2500)

  const stats = [
    { 
      value: courses.count, 
      suffix: '+', 
      label: 'Courses', 
      icon: '📚',
      ref: courses.ref,
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: instructors.count, 
      suffix: '+', 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      ref: instructors.ref,
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: lessons.count, 
      suffix: '+', 
      label: 'Lessons', 
      icon: '📖',
      ref: lessons.ref,
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: hours.count, 
      suffix: 'h+', 
      label: 'Learning Content', 
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
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" 
               style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
          <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center hover:border-navy-700 transition-all duration-300 hover:transform hover:scale-105">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}