'use client'

import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'
import Confetti from './Confetti'

interface LearningProgressProps {
  courseSlug: string
  totalLessons: number
  onProgressUpdate?: (progress: number) => void
}

export interface ProgressData {
  [courseSlug: string]: {
    completedLessons: string[]
    lastUpdated: string
  }
}

// Helper to get progress from localStorage
export function getProgressData(): ProgressData {
  if (typeof window === 'undefined') return {}
  const data = localStorage.getItem('learnhub-progress')
  return data ? JSON.parse(data) : {}
}

// Helper to save progress to localStorage
export function saveProgressData(data: ProgressData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('learnhub-progress', JSON.stringify(data))
}

// Helper to get course progress percentage
export function getCourseProgress(courseSlug: string, totalLessons: number): number {
  const data = getProgressData()
  const courseData = data[courseSlug]
  if (!courseData || totalLessons === 0) return 0
  return Math.round((courseData.completedLessons.length / totalLessons) * 100)
}

// Helper to mark lesson complete
export function markLessonComplete(courseSlug: string, lessonSlug: string): boolean {
  const data = getProgressData()
  
  if (!data[courseSlug]) {
    data[courseSlug] = {
      completedLessons: [],
      lastUpdated: new Date().toISOString()
    }
  }
  
  const isNew = !data[courseSlug].completedLessons.includes(lessonSlug)
  
  if (isNew) {
    data[courseSlug].completedLessons.push(lessonSlug)
    data[courseSlug].lastUpdated = new Date().toISOString()
    saveProgressData(data)
  }
  
  return isNew
}

// Helper to check if lesson is complete
export function isLessonComplete(courseSlug: string, lessonSlug: string): boolean {
  const data = getProgressData()
  return data[courseSlug]?.completedLessons.includes(lessonSlug) ?? false
}

export default function LearningProgress({ courseSlug, totalLessons, onProgressUpdate }: LearningProgressProps) {
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentProgress = getCourseProgress(courseSlug, totalLessons)
    setProgress(currentProgress)
    onProgressUpdate?.(currentProgress)
  }, [courseSlug, totalLessons, onProgressUpdate])

  // Listen for progress updates from other components
  useEffect(() => {
    const handleProgressUpdate = () => {
      const newProgress = getCourseProgress(courseSlug, totalLessons)
      const oldProgress = progress
      setProgress(newProgress)
      onProgressUpdate?.(newProgress)
      
      // Trigger confetti on milestone achievements
      if (newProgress > oldProgress) {
        if (newProgress === 100 || (newProgress >= 50 && oldProgress < 50) || (newProgress >= 25 && oldProgress < 25)) {
          setShowConfetti(true)
        }
      }
    }

    window.addEventListener('progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('progress-updated', handleProgressUpdate)
  }, [courseSlug, totalLessons, progress, onProgressUpdate])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <ProgressRing progress={0} size={40} strokeWidth={3} />
        <span className="text-sm text-navy-400">Loading...</span>
      </div>
    )
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="flex items-center gap-3">
        <ProgressRing progress={progress} size={40} strokeWidth={3} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {progress === 100 ? '🎉 Complete!' : `${progress}% Progress`}
          </span>
          <span className="text-xs text-navy-400">
            {Math.round((progress / 100) * totalLessons)} of {totalLessons} lessons
          </span>
        </div>
      </div>
    </>
  )
}