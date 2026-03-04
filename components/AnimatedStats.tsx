'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

function useCountAnimation(endValue: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4)
      const currentCount = Math.floor(easeOutQuart * endValue)
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }
      
      if (percentage < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [endValue, duration])

  return count
}

function StatCard({ 
  value, 
  label, 
  icon, 
  delay = 0 
}: { 
  value: number
  label: string
  icon: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const animatedValue = useCountAnimation(isVisible ? value : 0, 2000)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div 
      className={`text-center group cursor-default transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative inline-block">
        <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
          {icon}
        </div>
        <div className="absolute inset-0 blur-xl bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="text-3xl font-bold text-white tabular-nums">
        {animatedValue}
        <span className="text-primary-400">+</span>
      </div>
      <div className="text-navy-400 text-sm mt-1">{label}</div>
    </div>
  )
}

export default function AnimatedStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount
}: AnimatedStatsProps) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
      <StatCard value={coursesCount} label="Courses" icon="📚" delay={0} />
      <StatCard value={lessonsCount} label="Lessons" icon="📖" delay={150} />
      <StatCard value={instructorsCount} label="Instructors" icon="👨‍🏫" delay={300} />
      <StatCard value={categoriesCount} label="Categories" icon="🏷️" delay={450} />
    </div>
  )
}