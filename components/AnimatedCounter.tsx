'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCount()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, end, duration])

  const animateCount = () => {
    const startTime = performance.now()
    const startValue = 0

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  )
}