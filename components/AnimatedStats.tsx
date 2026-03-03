'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  totalCourses: number
  totalInstructors: number
  totalLessons: number
  totalLearningHours: number
}

interface StatItemProps {
  value: number
  label: string
  icon: string
  suffix?: string
  color: string
}

function useCountUp(end: number, duration: number = 2000, start: number = 0): number {
  const [count, setCount] = useState(start)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - start) + start))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration, start])

  return count
}

function StatItem({ value, label, icon, suffix = '', color }: StatItemProps) {
  const count = useCountUp(value)
  
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl`} />
      <div className="relative card p-8 text-center hover:scale-105 transition-transform duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <div className="text-4xl font-bold text-white mb-2">
          {count}{suffix}
        </div>
        <div className="text-navy-400 font-medium">{label}</div>
      </div>
    </div>
  )
}

export default function AnimatedStats({ 
  totalCourses, 
  totalInstructors, 
  totalLessons,
  totalLearningHours 
}: AnimatedStatsProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
      <p className="text-navy-400 mb-12 max-w-2xl mx-auto">
        Join our growing community of learners and discover why students love learning with us
      </p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem 
          value={totalCourses} 
          label="Courses" 
          icon="📚" 
          suffix="+"
          color="from-blue-500/20 to-blue-600/20"
        />
        <StatItem 
          value={totalLessons} 
          label="Lessons" 
          icon="📖" 
          suffix="+"
          color="from-green-500/20 to-green-600/20"
        />
        <StatItem 
          value={totalLearningHours} 
          label="Hours of Content" 
          icon="⏱️" 
          suffix="+"
          color="from-purple-500/20 to-purple-600/20"
        />
        <StatItem 
          value={totalInstructors} 
          label="Expert Instructors" 
          icon="👨‍🏫" 
          suffix=""
          color="from-orange-500/20 to-orange-600/20"
        />
      </div>
      
      {/* Trust badges */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-navy-500 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Lifetime Access</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Certificate of Completion</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Industry Experts</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>30-Day Guarantee</span>
        </div>
      </div>
    </div>
  )
}