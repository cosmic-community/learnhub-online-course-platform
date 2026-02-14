'use client'

import { useEffect, useState, useRef } from 'react'

interface QuickStatsProps {
  courseCount: number
  lessonCount: number
  instructorCount: number
  categoryCount: number
}

function AnimatedCounter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function QuickStats({ courseCount, lessonCount, instructorCount, categoryCount }: QuickStatsProps) {
  const stats = [
    { icon: '📚', label: 'Courses', value: courseCount, suffix: '+' },
    { icon: '📖', label: 'Lessons', value: lessonCount, suffix: '+' },
    { icon: '👨‍🏫', label: 'Expert Instructors', value: instructorCount, suffix: '' },
    { icon: '🏷️', label: 'Categories', value: categoryCount, suffix: '' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="relative group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-navy-800/50 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-xl p-6 text-center transition-all duration-300 hover:border-primary-500/50 hover:transform hover:-translate-y-1">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}