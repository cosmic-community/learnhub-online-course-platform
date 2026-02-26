'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - start) + start))

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
  }, [isVisible, end, duration, start])

  return { count, ref }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const categories = useCountUp(categoriesCount)
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
      color: 'from-green-400 to-green-600'
    },
    { 
      value: instructors.count, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫', 
      ref: instructors.ref,
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: categories.count, 
      label: 'Categories', 
      icon: '🎯', 
      ref: categories.ref,
      suffix: '',
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          ref={stat.ref}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-center p-6 rounded-2xl bg-navy-900/50 border border-navy-800 backdrop-blur-sm transition-all duration-300 hover:border-navy-700 hover:bg-navy-900/70 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10">
            <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}