'use client'

import { useEffect, useState, useRef } from 'react'

interface StatsCounterProps {
  value: number
  suffix?: string
  label: string
  duration?: number
}

export default function StatsCounter({ 
  value, 
  suffix = '', 
  label,
  duration = 2000 
}: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, value, duration])

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
        <span className="inline-block transition-transform duration-300 group-hover:scale-110">
          {count}
        </span>
        <span className="text-primary-400">{suffix}</span>
      </div>
      <div className="text-navy-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}