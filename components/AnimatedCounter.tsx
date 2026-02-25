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
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))
            if (progress < 1) {
              requestAnimationFrame(animate)
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
  }, [end, duration, hasAnimated])

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  )
}