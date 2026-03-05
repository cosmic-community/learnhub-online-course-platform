'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
  totalHours: number
  lessonCount: number
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
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
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

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
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

function StatCard({ 
  value, 
  label, 
  icon, 
  suffix = '',
  delay = 0 
}: { 
  value: number
  label: string
  icon: string
  suffix?: string
  delay?: number
}) {
  const { count, ref } = useCountUp(value, 2000 + delay)
  
  return (
    <div 
      ref={ref}
      className="text-center group"
    >
      <div className="relative inline-block mb-2">
        <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{icon}</span>
        <div className="absolute -inset-2 bg-primary-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform" />
      </div>
      <div className="text-3xl font-bold text-white tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}

export default function AnimatedStats({ 
  courseCount, 
  instructorCount, 
  categoryCount,
  totalHours,
  lessonCount
}: AnimatedStatsProps) {
  return (
    <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
        <StatCard 
          value={courseCount} 
          label="Courses" 
          icon="📚" 
          suffix="+"
          delay={0}
        />
        <StatCard 
          value={lessonCount} 
          label="Lessons" 
          icon="📖" 
          suffix="+"
          delay={100}
        />
        <StatCard 
          value={totalHours} 
          label="Hours of Content" 
          icon="⏱️" 
          suffix="+"
          delay={200}
        />
        <StatCard 
          value={instructorCount} 
          label="Instructors" 
          icon="👨‍🏫" 
          suffix="+"
          delay={300}
        />
        <StatCard 
          value={categoryCount} 
          label="Categories" 
          icon="🏷️" 
          delay={400}
        />
      </div>
    </div>
  )
}