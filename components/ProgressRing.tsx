'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  animated?: boolean
}

export default function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  className = '',
  showPercentage = true,
  animated = true,
}: ProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : progress)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayProgress / 100) * circumference
  
  useEffect(() => {
    if (!animated) {
      setDisplayProgress(progress)
      return
    }
    
    // Animate the progress
    const duration = 1000
    const startTime = Date.now()
    const startProgress = displayProgress
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - t, 3)
      const current = startProgress + (progress - startProgress) * eased
      
      setDisplayProgress(current)
      
      if (t < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [progress, animated])
  
  // Color based on progress
  const getColor = () => {
    if (displayProgress >= 100) return '#14b8a6' // primary-500
    if (displayProgress >= 75) return '#2dd4bf' // primary-400
    if (displayProgress >= 50) return '#5eead4' // primary-300
    if (displayProgress >= 25) return '#99f6e4' // primary-200
    return '#ccfbf1' // primary-100
  }
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
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
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{
            filter: displayProgress >= 100 ? 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.5))' : 'none',
          }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
      
      {/* Completion celebration */}
      {displayProgress >= 100 && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <span className="text-lg">✨</span>
        </div>
      )}
    </div>
  )
}