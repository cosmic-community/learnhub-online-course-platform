'use client'

import { useEffect, useState, useRef } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  lessonsCount: number
  hoursCount: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
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

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  lessonsCount,
  hoursCount 
}: LearningStatsProps) {
  const courses = useCountUp(coursesCount, 2000)
  const instructors = useCountUp(instructorsCount, 2000)
  const lessons = useCountUp(lessonsCount, 2500)
  const hours = useCountUp(hoursCount, 2000)

  const stats = [
    { 
      value: courses.count, 
      label: 'Courses', 
      icon: '📚', 
      ref: courses.ref,
      suffix: '+',
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫', 
      ref: instructors.ref,
      suffix: '+',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: lessons.count, 
      label: 'Video Lessons', 
      icon: '🎬', 
      ref: lessons.ref,
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: hours.count, 
      label: 'Hours of Content', 
      icon: '⏱️', 
      ref: hours.ref,
      suffix: 'h+',
      color: 'from-amber-400 to-amber-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="stat-card group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="stat-icon-wrapper">
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
              {stat.icon}
            </span>
          </div>
          <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}