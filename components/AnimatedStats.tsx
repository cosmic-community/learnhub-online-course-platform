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
    }
  }, [startOnView])

  useEffect(() => {
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
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
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

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-navy-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary-500 transition-all duration-1000 ease-out"
      />
    </svg>
  )
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
      ref: courses.ref, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      value: instructors.count, 
      ref: instructors.ref, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-purple-500 to-pink-400'
    },
    { 
      value: lessons.count, 
      ref: lessons.ref, 
      label: 'Video Lessons', 
      icon: '🎬',
      suffix: '+',
      color: 'from-orange-500 to-yellow-400'
    },
    { 
      value: hours.count, 
      ref: hours.ref, 
      label: 'Hours of Content', 
      icon: '⏱️',
      suffix: '+',
      color: 'from-green-500 to-emerald-400'
    },
    { 
      value: categories.count, 
      ref: categories.ref, 
      label: 'Categories', 
      icon: '🏷️',
      suffix: '',
      color: 'from-primary-500 to-primary-400'
    },
  ]

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            ref={stat.ref}
            className="relative group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card p-6 text-center hover:scale-105 transition-transform duration-300 cursor-default">
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}