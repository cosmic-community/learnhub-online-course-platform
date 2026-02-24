'use client'

import { useState, useEffect, useRef } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  lessonsCount: number
}

function AnimatedCounter({ 
  target, 
  suffix = '', 
  duration = 2000 
}: { 
  target: number
  suffix?: string
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            const startTime = Date.now()
            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              
              // Easing function for smooth animation
              const easeOut = 1 - Math.pow(1 - progress, 3)
              setCount(Math.floor(easeOut * target))
              
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return (
    <div ref={ref} className="text-3xl font-bold text-white">
      {count}{suffix}
    </div>
  )
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalHours,
  lessonsCount
}: LearningStatsProps) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Simulate a learning streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }
    
    localStorage.setItem('last-visit-date', today)
  }, [])

  return (
    <div className="mt-16">
      {/* Streak Banner */}
      {streak > 0 && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full animate-pulse-slow">
            <span className="text-2xl">🔥</span>
            <span className="text-orange-400 font-semibold">
              {streak} Day Streak! Keep learning!
            </span>
            <div className="flex -space-x-1">
              {[...Array(Math.min(streak, 7))].map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 bg-orange-500 rounded-full border-2 border-navy-950 flex items-center justify-center text-xs"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  ✓
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
          <AnimatedCounter target={coursesCount} suffix="+" />
          <div className="text-navy-400 text-sm mt-1">Courses</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📖</div>
          <AnimatedCounter target={lessonsCount} suffix="+" />
          <div className="text-navy-400 text-sm mt-1">Lessons</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👨‍🏫</div>
          <AnimatedCounter target={instructorsCount} suffix="+" />
          <div className="text-navy-400 text-sm mt-1">Instructors</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
          <AnimatedCounter target={totalHours} suffix="h" />
          <div className="text-navy-400 text-sm mt-1">Content</div>
        </div>
        
        <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group col-span-2 md:col-span-1">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
          <AnimatedCounter target={categoriesCount} />
          <div className="text-navy-400 text-sm mt-1">Categories</div>
        </div>
      </div>
    </div>
  )
}