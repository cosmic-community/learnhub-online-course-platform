'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0 to 100
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressRing({ 
  progress, 
  size = 60, 
  strokeWidth = 4,
  className = ''
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getColor = () => {
    if (progress === 100) return '#22c55e' // green
    if (progress >= 75) return '#29ABE2' // primary blue
    if (progress >= 50) return '#f59e0b' // amber
    return '#6366f1' // indigo
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  )
}