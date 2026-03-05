'use client'

import { useState, useEffect, useRef } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
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

    let startTime: number
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
  }, [end, duration, isVisible])

  return { count, ref }
}

function StatCard({ 
  icon, 
  value, 
  label, 
  suffix = '',
  delay = 0 
}: { 
  icon: string
  value: number
  label: string
  suffix?: string
  delay?: number
}) {
  const { count, ref } = useCountUp(value, 2000 + delay)
  
  return (
    <div 
      ref={ref}
      className="text-center group"
    >
      <div className="relative inline-block mb-2">
        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
        <span className="relative text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">
          {icon}
        </span>
      </div>
      <div className="text-3xl font-bold text-white tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  totalLessons
}: LearningStatsProps) {
  const [streak, setStreak] = useState(0)
  
  useEffect(() => {
    // Simulate a learning streak (in a real app, this would come from user data)
    const savedStreak = localStorage.getItem('learning-streak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10))
    } else {
      // First visit - start a streak!
      const randomStreak = Math.floor(Math.random() * 5) + 1
      setStreak(randomStreak)
      localStorage.setItem('learning-streak', randomStreak.toString())
    }
    
    // Update last visit
    localStorage.setItem('last-visit', new Date().toISOString())
  }, [])

  return (
    <div className="mt-16">
      {/* Streak Banner */}
      {streak > 0 && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-6 py-3">
            <div className="flex items-center">
              {[...Array(Math.min(streak, 5))].map((_, i) => (
                <span 
                  key={i} 
                  className="text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  🔥
                </span>
              ))}
            </div>
            <div className="text-white">
              <span className="font-bold">{streak} Day Streak!</span>
              <span className="text-orange-300 ml-2 text-sm">Keep learning daily</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-8">
        <StatCard 
          icon="📚" 
          value={coursesCount} 
          label="Courses" 
          suffix="+"
          delay={0}
        />
        <StatCard 
          icon="📖" 
          value={totalLessons} 
          label="Lessons" 
          suffix="+"
          delay={100}
        />
        <StatCard 
          icon="⏱️" 
          value={totalHours} 
          label="Hours of Content" 
          suffix="+"
          delay={200}
        />
        <StatCard 
          icon="👨‍🏫" 
          value={instructorsCount} 
          label="Instructors" 
          suffix="+"
          delay={300}
        />
        <StatCard 
          icon="🏷️" 
          value={categoriesCount} 
          label="Categories" 
          delay={400}
        />
      </div>
    </div>
  )
}