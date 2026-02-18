'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  courses: number
  instructors: number
  categories: number
  lessons: number
  hours: number
}

function useCountUp(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number | null = null
          
          const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * target))
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }
          
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
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
  }, [target, duration, hasAnimated])

  return count
}

function StatCard({ 
  value, 
  label, 
  icon, 
  suffix = '' 
}: { 
  value: number
  label: string
  icon: string
  suffix?: string
}) {
  const animatedValue = useCountUp(value)
  
  return (
    <div className="text-center group">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">{icon}</span>
          <span className="text-3xl font-bold text-white tabular-nums">
            {animatedValue}{suffix}
          </span>
        </div>
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}

export default function AnimatedStats({ 
  courses, 
  instructors, 
  categories, 
  lessons, 
  hours 
}: AnimatedStatsProps) {
  return (
    <div className="mt-16 p-6 bg-navy-900/30 backdrop-blur-sm border border-navy-800 rounded-2xl max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <StatCard value={courses} label="Courses" icon="📚" suffix="+" />
        <StatCard value={lessons} label="Lessons" icon="📖" suffix="+" />
        <StatCard value={hours} label="Hours of Content" icon="⏱️" suffix="+" />
        <StatCard value={instructors} label="Expert Instructors" icon="👨‍🏫" suffix="+" />
        <StatCard value={categories} label="Categories" icon="🏷️" />
      </div>
    </div>
  )
}