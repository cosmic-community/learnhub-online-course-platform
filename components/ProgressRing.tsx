'use client'

import { useState, useEffect } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  className?: string
}

export default function ProgressRing({ 
  progress, 
  size = 48, 
  strokeWidth = 4,
  showPercentage = true,
  className = ''
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getProgressColor = (p: number): string => {
    if (p >= 100) return '#22c55e' // green-500
    if (p >= 75) return '#84cc16' // lime-500
    if (p >= 50) return '#eab308' // yellow-500
    if (p >= 25) return '#f97316' // orange-500
    return '#6366f1' // primary-500
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="progress-ring"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-navy-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={getProgressColor(progress)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      
      {showPercentage && (
        <span className="absolute text-xs font-bold text-white">
          {Math.round(animatedProgress)}%
        </span>
      )}

      {/* Completion sparkle */}
      {progress >= 100 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="absolute text-green-400 text-lg sparkle">✓</span>
        </div>
      )}
    </div>
  )
}