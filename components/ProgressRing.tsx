'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  animated?: boolean
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
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

    const duration = 1500
    const startTime = Date.now()
    const startProgress = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progressRatio, 3)
      const currentProgress = startProgress + (progress - startProgress) * easeOut
      
      setDisplayProgress(currentProgress)
      
      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [progress, animated])

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
          fill="transparent"
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {Math.round(displayProgress)}%
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