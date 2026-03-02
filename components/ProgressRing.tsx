'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  showPercentage?: boolean
}

export default function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  label,
  showPercentage = true 
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    // Animate the progress
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getColorClass = () => {
    if (progress >= 100) return 'text-green-500'
    if (progress >= 75) return 'text-primary-500'
    if (progress >= 50) return 'text-yellow-500'
    if (progress >= 25) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColorClass()} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className={`text-2xl font-bold ${getColorClass()}`}>
            {Math.round(animatedProgress)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-navy-400 mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}