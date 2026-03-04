'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  courses: number
  instructors: number
  categories: number
  lessons: number
  hours: number
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number | null = null
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
  }, [end, duration, start])
  
  return count
}

export default function AnimatedStats({ 
  courses, 
  instructors, 
  categories, 
  lessons, 
  hours 
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const courseCount = useCountUp(courses, 2000, isVisible)
  const instructorCount = useCountUp(instructors, 2000, isVisible)
  const categoryCount = useCountUp(categories, 1500, isVisible)
  const lessonCount = useCountUp(lessons, 2500, isVisible)
  const hourCount = useCountUp(hours, 2000, isVisible)
  
  const stats = [
    { value: courseCount, label: 'Courses', icon: '📚', suffix: '+' },
    { value: lessonCount, label: 'Lessons', icon: '📖', suffix: '+' },
    { value: hourCount, label: 'Hours of Content', icon: '⏱️', suffix: '+' },
    { value: instructorCount, label: 'Expert Instructors', icon: '👨‍🏫', suffix: '+' },
    { value: categoryCount, label: 'Categories', icon: '🏷️', suffix: '' },
  ]
  
  return (
    <div 
      ref={ref}
      className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto"
    >
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800/50 backdrop-blur-sm
            transform transition-all duration-500 hover:scale-105 hover:border-primary-500/30
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-white tabular-nums">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}