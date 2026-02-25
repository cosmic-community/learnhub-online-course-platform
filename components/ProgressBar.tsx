'use client'

import { useState, useEffect } from 'react'

interface ProgressBarProps {
  courseSlug: string
  totalLessons: number
  className?: string
}

export default function ProgressBar({ courseSlug, totalLessons, className = '' }: ProgressBarProps) {
  const [completedLessons, setCompletedLessons] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const progressKey = `learnhub-progress-${courseSlug}`
    const stored = localStorage.getItem(progressKey)
    if (stored) {
      const progress = JSON.parse(stored)
      setCompletedLessons(progress.completed?.length || 0)
    }
  }, [courseSlug])

  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (percentage === 100) return 'from-green-500 to-emerald-400'
    if (percentage >= 75) return 'from-primary-500 to-cyan-400'
    if (percentage >= 50) return 'from-yellow-500 to-orange-400'
    if (percentage >= 25) return 'from-orange-500 to-red-400'
    return 'from-red-500 to-pink-400'
  }

  // Get milestone message
  const getMilestoneMessage = () => {
    if (percentage === 100) return '🎉 Course Complete!'
    if (percentage >= 75) return '🔥 Almost there!'
    if (percentage >= 50) return '💪 Halfway point!'
    if (percentage >= 25) return '🚀 Great progress!'
    if (percentage > 0) return '✨ Keep going!'
    return '📚 Start learning!'
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-navy-400">
          {completedLessons} of {totalLessons} lessons
        </span>
        <span className="text-sm font-medium text-primary-400">
          {getMilestoneMessage()}
        </span>
      </div>
      
      <div className="relative h-3 bg-navy-700 rounded-full overflow-hidden">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        
        {/* Progress bar */}
        <div 
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated glow */}
          {percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Percentage display */}
      <div className="mt-2 text-right">
        <span className={`text-2xl font-bold bg-gradient-to-r ${getProgressColor()} text-transparent bg-clip-text`}>
          {percentage}%
        </span>
      </div>
      
      {/* Confetti effect placeholder */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Confetti particles would go here */}
        </div>
      )}
    </div>
  )
}