'use client'

import { useEffect, useState, useRef } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  lessonsCount: number
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
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true)
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [startOnView, hasStarted])

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
  categoriesCount, 
  totalHours,
  lessonsCount 
}: LearningStatsProps) {
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const hours = useCountUp(totalHours)
  const lessons = useCountUp(lessonsCount)

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
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: hours.count, 
      label: 'Hours of Content', 
      icon: '⏱️', 
      ref: hours.ref,
      suffix: '+',
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫', 
      ref: instructors.ref,
      suffix: '+',
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="group relative text-center p-6 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 animate-fade-in"
          style={{ animationDelay: `${index * 100 + 400}ms` }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
               style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
          
          <span className="text-3xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">
            {stat.icon}
          </span>
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}