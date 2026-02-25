'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
  animated?: boolean
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#22c55e',
  label,
  sublabel,
  animated = true
}: ProgressRingProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (currentProgress / 100) * circumference

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setCurrentProgress(progress)
    }
  }, [progress, animated])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">
          {Math.round(currentProgress)}%
        </span>
        {label && (
          <span className="text-xs text-navy-400 mt-1">{label}</span>
        )}
        {sublabel && (
          <span className="text-xs text-navy-500">{sublabel}</span>
        )}
      </div>
    </div>
  )
}