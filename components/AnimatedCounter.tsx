'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  label: string
  icon: string
  duration?: number
}

export default function AnimatedCounter({ 
  end, 
  suffix = '', 
  label, 
  icon,
  duration = 2000 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(easeOutQuart * (end - startValue) + startValue)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div 
      ref={counterRef}
      className={`text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800 transition-all duration-500 hover:border-primary-500/30 hover:bg-navy-900/70 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">
        <span className="tabular-nums">{count}</span>
        <span className="text-primary-400">{suffix}</span>
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}