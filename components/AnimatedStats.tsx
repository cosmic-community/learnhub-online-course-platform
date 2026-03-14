'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
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

interface StatCardProps {
  value: number
  label: string
  icon: string
  suffix?: string
  color: string
}

function StatCard({ value, label, icon, suffix = '', color }: StatCardProps) {
  const { count, ref } = useCountUp(value, 2000)

  return (
    <div 
      ref={ref}
      className={`text-center group cursor-default transition-transform duration-300 hover:scale-105`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300 group-hover:scale-110 ${color}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-navy-400 text-sm font-medium">{label}</div>
    </div>
  )
}

export default function AnimatedStats({ 
  courseCount, 
  instructorCount, 
  categoryCount, 
  totalHours, 
  totalLessons 
}: AnimatedStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
      <StatCard 
        value={courseCount} 
        label="Courses" 
        icon="📚"
        suffix="+"
        color="bg-primary-500/20"
      />
      <StatCard 
        value={totalLessons} 
        label="Lessons" 
        icon="📖"
        suffix="+"
        color="bg-green-500/20"
      />
      <StatCard 
        value={totalHours} 
        label="Hours of Content" 
        icon="⏱️"
        suffix="+"
        color="bg-yellow-500/20"
      />
      <StatCard 
        value={instructorCount} 
        label="Expert Instructors" 
        icon="👨‍🏫"
        suffix="+"
        color="bg-purple-500/20"
      />
      <StatCard 
        value={categoryCount} 
        label="Categories" 
        icon="🏷️"
        suffix=""
        color="bg-blue-500/20"
      />
    </div>
  )
}