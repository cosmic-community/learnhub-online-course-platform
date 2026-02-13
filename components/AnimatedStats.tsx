'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  hoursCount: number
}

function useCountAnimation(end: number, duration: number = 2000, startAnimation: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!startAnimation) return
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
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
  }, [end, duration, startAnimation])
  
  return count
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount,
  hoursCount
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const animatedCourses = useCountAnimation(coursesCount, 1500, isVisible)
  const animatedInstructors = useCountAnimation(instructorsCount, 1500, isVisible)
  const animatedLessons = useCountAnimation(lessonsCount, 2000, isVisible)
  const animatedHours = useCountAnimation(hoursCount, 1800, isVisible)
  const animatedCategories = useCountAnimation(categoriesCount, 1200, isVisible)
  
  return (
    <div 
      ref={containerRef}
      className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto"
    >
      <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {animatedCourses}+
        </div>
        <div className="text-navy-400 text-sm mt-1">Courses</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {animatedLessons}+
        </div>
        <div className="text-navy-400 text-sm mt-1">Lessons</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {animatedHours}+
        </div>
        <div className="text-navy-400 text-sm mt-1">Hours</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-colors group">
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {animatedInstructors}+
        </div>
        <div className="text-navy-400 text-sm mt-1">Experts</div>
      </div>
      
      <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-colors group col-span-2 md:col-span-1">
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
          {animatedCategories}
        </div>
        <div className="text-navy-400 text-sm mt-1">Categories</div>
      </div>
    </div>
  )
}