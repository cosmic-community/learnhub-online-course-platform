'use client'

import { useEffect, useState, useRef } from 'react'

interface PlatformStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, start])
  
  return count
}

export default function PlatformStats({ coursesCount, instructorsCount, categoriesCount }: PlatformStatsProps) {
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
      { threshold: 0.5 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const coursesAnimated = useCountUp(coursesCount, 1500, isVisible)
  const instructorsAnimated = useCountUp(instructorsCount, 1500, isVisible)
  const categoriesAnimated = useCountUp(categoriesCount, 1500, isVisible)
  const studentsAnimated = useCountUp(10000, 2000, isVisible)
  
  return (
    <div 
      ref={ref}
      className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto"
    >
      <div className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0ms' }}>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          {coursesAnimated}+
        </div>
        <div className="text-navy-400 text-sm">Courses</div>
      </div>
      
      <div className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          {instructorsAnimated}+
        </div>
        <div className="text-navy-400 text-sm">Instructors</div>
      </div>
      
      <div className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          {categoriesAnimated}
        </div>
        <div className="text-navy-400 text-sm">Categories</div>
      </div>
      
      <div className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">
          {studentsAnimated.toLocaleString()}+
        </div>
        <div className="text-navy-400 text-sm">Students</div>
      </div>
    </div>
  )
}