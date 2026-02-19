'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedStatProps {
  value: number
  label: string
  suffix?: string
  delay?: number
}

export default function AnimatedStat({ value, label, suffix = '+', delay = 0 }: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          // Delay before starting animation
          setTimeout(() => {
            const duration = 2000
            const startTime = Date.now()
            
            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              
              // Easing function for smooth deceleration
              const easeOut = 1 - Math.pow(1 - progress, 3)
              const current = Math.floor(easeOut * value)
              
              setDisplayValue(current)
              
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            
            requestAnimationFrame(animate)
          }, delay)
        }
      },
      { threshold: 0.5 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [value, delay, hasAnimated])

  return (
    <div 
      ref={ref}
      className="text-center group cursor-default"
    >
      <div className="relative">
        <div className="text-3xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
          {displayValue}{suffix}
        </div>
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 rounded-lg blur-xl transition-all duration-300" />
      </div>
      <div className="text-navy-400 text-sm mt-1">{label}</div>
    </div>
  )
}