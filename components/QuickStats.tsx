'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  icon: string
  label: string
  value: number | string
  suffix?: string
  delay?: number
}

export default function QuickStats({ icon, label, value, suffix = '', delay = 0 }: QuickStatsProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      
      // Animate number counting up
      if (typeof value === 'number') {
        const duration = 1000
        const steps = 30
        const stepValue = value / steps
        let current = 0
        
        const interval = setInterval(() => {
          current += stepValue
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(interval)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, duration / steps)
        
        return () => clearInterval(interval)
      }
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <div 
      className={`text-center transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white">
        {typeof value === 'number' ? displayValue : value}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}