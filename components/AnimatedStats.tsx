'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
  totalHours: number
  totalLessons: number
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setHasStarted(true)
            observer.disconnect()
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [startOnView])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
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
  }, [end, duration, hasStarted])

  return { count, ref }
}

export default function AnimatedStats({
  courseCount,
  instructorCount,
  categoryCount,
  totalHours,
  totalLessons,
}: AnimatedStatsProps) {
  const courses = useCountUp(courseCount)
  const instructors = useCountUp(instructorCount)
  const categories = useCountUp(categoryCount)
  const hours = useCountUp(totalHours)
  const lessons = useCountUp(totalLessons)

  const stats = [
    { label: 'Courses', value: courses.count, suffix: '+', icon: '📚', ref: courses.ref },
    { label: 'Lessons', value: lessons.count, suffix: '+', icon: '📖', ref: lessons.ref },
    { label: 'Hours of Content', value: hours.count, suffix: '+', icon: '⏱️', ref: hours.ref },
    { label: 'Instructors', value: instructors.count, suffix: '+', icon: '👨‍🏫', ref: instructors.ref },
    { label: 'Categories', value: categories.count, suffix: '', icon: '🏷️', ref: categories.ref },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          ref={stat.ref}
          className="text-center group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy-800/50 text-2xl mb-3 group-hover:scale-110 group-hover:bg-primary-500/20 transition-all duration-300">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}