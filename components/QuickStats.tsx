'use client'

import { useState, useEffect, useRef } from 'react'

interface StatItemProps {
  icon: string
  value: number
  label: string
  suffix?: string
  color: string
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 1500
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const current = Math.floor(easeOutQuart * value)
            
            setDisplayed(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setDisplayed(value)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-3xl font-bold text-white">
      {displayed}{suffix}
    </div>
  )
}

function StatItem({ icon, value, label, suffix = '', color }: StatItemProps) {
  return (
    <div className="text-center group">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${color} mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <AnimatedNumber value={value} suffix={suffix} />
      <div className="text-navy-400 text-sm mt-1">{label}</div>
    </div>
  )
}

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount?: number
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount = 0 
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <StatItem 
        icon="📚" 
        value={coursesCount} 
        label="Courses" 
        suffix="+"
        color="from-primary-500/20 to-primary-600/20"
      />
      <StatItem 
        icon="👨‍🏫" 
        value={instructorsCount} 
        label="Expert Instructors" 
        suffix="+"
        color="from-blue-500/20 to-blue-600/20"
      />
      <StatItem 
        icon="📖" 
        value={lessonsCount || categoriesCount * 8} 
        label="Video Lessons" 
        suffix="+"
        color="from-purple-500/20 to-purple-600/20"
      />
      <StatItem 
        icon="🏆" 
        value={categoriesCount} 
        label="Skill Tracks"
        color="from-yellow-500/20 to-yellow-600/20"
      />
    </div>
  )
}