'use client'

import { useState, useEffect, useRef } from 'react'

interface StatProps {
  value: number
  label: string
  suffix?: string
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            
            const duration = 2000
            const steps = 60
            const stepDuration = duration / steps
            const increment = value / steps
            
            let current = 0
            const timer = setInterval(() => {
              current += increment
              if (current >= value) {
                setDisplayValue(value)
                clearInterval(timer)
              } else {
                setDisplayValue(Math.floor(current))
              }
            }, stepDuration)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white tabular-nums">
      {displayValue}{suffix}
    </div>
  )
}

interface AnimatedStatsProps {
  stats: StatProps[]
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          className="text-center group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}