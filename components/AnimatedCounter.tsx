'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  label: string
  icon: string
  delay?: number
}

export default function AnimatedCounter({ value, suffix = '', label, icon, delay = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
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

    const startTime = Date.now()
    const duration = 2000 // 2 seconds animation
    const startDelay = delay

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - startDelay
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(easeOutQuart * value)
        
        setCount(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(value)
        }
      }
      
      requestAnimationFrame(animate)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [isVisible, value, delay])

  return (
    <div 
      ref={ref}
      className="text-center p-6 bg-navy-900/50 rounded-2xl border border-navy-800 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 group"
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        <span className="tabular-nums">{count}</span>
        <span className="text-primary-400">{suffix}</span>
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}