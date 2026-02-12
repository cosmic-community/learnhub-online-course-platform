'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  showPercentage?: boolean
  animated?: boolean
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true,
  animated = true
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayProgress / 100) * circumference

  useEffect(() => {
    if (animated) {
      // Animate the progress
      const duration = 1500
      const startTime = Date.now()
      const startProgress = displayProgress
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progressRatio = Math.min(elapsed / duration, 1)
        
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progressRatio, 3)
        const newProgress = startProgress + (progress - startProgress) * eased
        
        setDisplayProgress(newProgress)
        
        if (progressRatio < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    } else {
      setDisplayProgress(progress)
    }
  }, [progress, animated])

  const getProgressColor = (value: number): string => {
    if (value >= 100) return '#14b8a6' // primary-500 - complete
    if (value >= 75) return '#22c55e' // green-500
    if (value >= 50) return '#f59e0b' // amber-500
    if (value >= 25) return '#3b82f6' // blue-500
    return '#64748b' // navy-500
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
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-navy-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(displayProgress)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
          style={{
            filter: displayProgress >= 100 ? 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.5))' : 'none'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-white">
            {Math.round(displayProgress)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-navy-400 mt-1">{label}</span>
        )}
        {displayProgress >= 100 && (
          <span className="text-lg mt-1">✓</span>
        )}
      </div>
    </div>
  )
}