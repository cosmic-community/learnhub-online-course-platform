'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    
    const element = document.getElementById('stats-section')
    if (element) {
      observer.observe(element)
    }
    
    return () => observer.disconnect()
  }, [end, duration])

  return count
}

export default function AnimatedStats({ courseCount, instructorCount, categoryCount }: AnimatedStatsProps) {
  const courses = useCountUp(courseCount, 1500)
  const instructors = useCountUp(instructorCount, 1500)
  const categories = useCountUp(categoryCount, 1500)

  const stats = [
    { 
      value: courses, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      color: 'from-primary-400 to-primary-600'
    },
    { 
      value: instructors, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: categories, 
      label: 'Categories', 
      icon: '🎯',
      suffix: '',
      color: 'from-orange-400 to-orange-600'
    },
  ]

  return (
    <div id="stats-section" className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="text-center group cursor-default"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative">
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-full`} />
            
            <div className="relative">
              <span className="text-2xl sm:text-3xl mb-2 block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12">
                {stat.icon}
              </span>
              <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-navy-400 text-xs sm:text-sm mt-1">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}