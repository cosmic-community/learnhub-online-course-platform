'use client'

import { useEffect, useState } from 'react'

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: string
}

const stats: StatItem[] = [
  { label: 'Active Learners', value: 12500, suffix: '+', icon: '👨‍🎓' },
  { label: 'Hours of Content', value: 850, suffix: '+', icon: '⏱️' },
  { label: 'Course Completions', value: 45000, suffix: '+', icon: '🏆' },
  { label: 'Countries Reached', value: 120, suffix: '+', icon: '🌍' },
]

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * target)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [hasStarted, target, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function LearningStatsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-primary-500/10 border-y border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-2xl animate-bounce">{stats[currentIndex]?.icon}</span>
          <span className="text-primary-400 font-bold text-lg">
            <AnimatedCounter target={stats[currentIndex]?.value ?? 0} duration={1500} />
            {stats[currentIndex]?.suffix}
          </span>
          <span className="text-navy-300">{stats[currentIndex]?.label}</span>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-2">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-400 w-6' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`Show stat ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}