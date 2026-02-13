'use client'

import { useState, useEffect, useRef } from 'react'

interface StatCardProps {
  value: number
  label: string
  icon: React.ReactNode
  delay: number
  suffix?: string
  color: string
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, isVisible])

  return <span ref={ref}>{count}</span>
}

function StatCard({ value, label, icon, delay, suffix = '', color }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-500 transform hover:scale-105`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      
      <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-colors">
        {/* Animated icon */}
        <div className={`w-12 h-12 rounded-xl ${color.replace('bg-', 'bg-').replace('/50', '/20')} flex items-center justify-center mb-4 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
          {icon}
        </div>

        {/* Animated number */}
        <div className="text-3xl font-bold text-white mb-1">
          <AnimatedCounter value={value} />
          <span className="text-primary-400">{suffix}</span>
        </div>
        
        <div className="text-navy-400 text-sm">{label}</div>

        {/* Sparkle effect on hover */}
        {isHovered && (
          <>
            <div className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full animate-ping" />
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-primary-300 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-12 right-12 w-1 h-1 bg-primary-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
          </>
        )}
      </div>
    </div>
  )
}

interface InteractiveStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function InteractiveStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: InteractiveStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        value={coursesCount}
        label="Courses Available"
        suffix="+"
        delay={0}
        color="bg-primary-500"
        icon={
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />
      <StatCard
        value={lessonsCount}
        label="Video Lessons"
        suffix="+"
        delay={100}
        color="bg-purple-500"
        icon={
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        value={instructorsCount}
        label="Expert Instructors"
        suffix="+"
        delay={200}
        color="bg-amber-500"
        icon={
          <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <StatCard
        value={categoriesCount}
        label="Categories"
        suffix=""
        delay={300}
        color="bg-emerald-500"
        icon={
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
      />
    </div>
  )
}