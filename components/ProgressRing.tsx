'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  animate?: boolean
}

export default function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  showPercentage = true,
  animate = true 
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(animate ? 0 : progress)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayProgress / 100) * circumference

  useEffect(() => {
    if (!animate) {
      setDisplayProgress(progress)
      return
    }
    
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [progress, animate])

  // Color based on progress
  const getColor = () => {
    if (displayProgress >= 100) return '#22c55e' // Green
    if (displayProgress >= 50) return '#3b82f6' // Blue
    if (displayProgress > 0) return '#f59e0b' // Amber
    return '#6b7280' // Gray
  }

  return (
    <div className="relative inline-flex items-center justify-center">
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
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={getColor()}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: animate ? 'stroke-dashoffset 1s ease-out, stroke 0.3s ease' : 'none',
          }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: getColor() }}
          >
            {Math.round(displayProgress)}%
          </span>
          <span className="text-xs text-navy-400">Complete</span>
        </div>
      )}
    </div>
  )
}