'use client'

import { useEffect, useState } from 'react'

interface LearningProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label: string
  color?: string
}

export default function LearningProgressRing({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  color = '#6366f1'
}: LearningProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = max > 0 ? (animatedValue / max) * 100 : 0
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-navy-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-xs text-navy-400">of {max}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-navy-300">{label}</span>
    </div>
  )
}