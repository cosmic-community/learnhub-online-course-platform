'use client'

import { useState, useEffect, useCallback } from 'react'
import ProgressRing from './ProgressRing'
import Confetti from './Confetti'
import { getCourseProgress, calculateProgressPercentage } from '@/lib/progress'
import type { Course } from '@/types'

interface CourseProgressCardProps {
  course: Course
}

export default function CourseProgressCard({ course }: CourseProgressCardProps) {
  const [progress, setProgress] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasShownConfetti, setHasShownConfetti] = useState(false)

  const totalLessons = course.metadata?.lessons?.length || 0

  const updateProgress = useCallback(() => {
    const courseProgress = getCourseProgress(course.slug)
    if (courseProgress) {
      const newCompleted = courseProgress.completedLessons.length
      const newProgress = calculateProgressPercentage(
        courseProgress.completedLessons,
        totalLessons
      )
      
      // Check if just completed the course
      if (newProgress === 100 && progress < 100 && !hasShownConfetti && progress > 0) {
        setShowConfetti(true)
        setHasShownConfetti(true)
      }
      
      setCompletedCount(newCompleted)
      setProgress(newProgress)
    }
  }, [course.slug, totalLessons, progress, hasShownConfetti])

  useEffect(() => {
    updateProgress()
    
    // Listen for storage changes (in case multiple tabs)
    const handleStorage = () => updateProgress()
    window.addEventListener('storage', handleStorage)
    
    // Poll for changes (for same-tab updates)
    const interval = setInterval(updateProgress, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [updateProgress])

  if (totalLessons === 0) return null

  return (
    <>
      <Confetti 
        active={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className="card p-6">
        <div className="flex items-center gap-6">
          <ProgressRing progress={progress} size={100} strokeWidth={8} />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Your Progress
            </h3>
            <p className="text-navy-400 mb-3">
              {completedCount} of {totalLessons} lessons completed
            </p>
            
            {progress === 100 ? (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Course Completed! 🎉</span>
              </div>
            ) : progress > 0 ? (
              <div className="text-sm text-navy-400">
                Keep going! You&apos;re making great progress.
              </div>
            ) : (
              <div className="text-sm text-navy-400">
                Start your first lesson to track progress
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${progress}%`,
              background: progress === 100 
                ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                : 'linear-gradient(90deg, #3b82f6, #2563eb)'
            }}
          />
        </div>
      </div>
    </>
  )
}