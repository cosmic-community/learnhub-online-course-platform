'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  lessonsCount: number
  hoursCount: number
}

function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - start) + start))
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
  }, [isVisible, end, duration, start])

  return { count, ref }
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  lessonsCount, 
  hoursCount 
}: AnimatedStatsProps) {
  const courses = useCountUp(coursesCount)
  const instructors = useCountUp(instructorsCount)
  const lessons = useCountUp(lessonsCount)
  const hours = useCountUp(hoursCount)

  return (
    <div ref={courses.ref} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-3xl">📚</span>
        </div>
        <div className="text-3xl font-bold text-white">{courses.count}+</div>
        <div className="text-navy-400 text-sm">Courses</div>
      </div>
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-3xl">👨‍🏫</span>
        </div>
        <div className="text-3xl font-bold text-white">{instructors.count}+</div>
        <div className="text-navy-400 text-sm">Instructors</div>
      </div>
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-3xl">📖</span>
        </div>
        <div className="text-3xl font-bold text-white">{lessons.count}+</div>
        <div className="text-navy-400 text-sm">Lessons</div>
      </div>
      <div className="text-center group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-3 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-3xl">⏱️</span>
        </div>
        <div className="text-3xl font-bold text-white">{hours.count}+</div>
        <div className="text-navy-400 text-sm">Hours of Content</div>
      </div>
    </div>
  )
}