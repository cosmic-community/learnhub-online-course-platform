'use client'

import { useEffect, useRef, useState } from 'react'
import { markLessonStarted, updateLessonProgress, getProgress } from '@/lib/progress'

interface LessonProgressTrackerProps {
  lessonId: string
  lessonSlug: string
  lessonTitle: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  totalLessonsInCourse: number
}

export default function LessonProgressTracker({
  lessonId,
  lessonSlug,
  lessonTitle,
  courseSlug,
  courseTitle,
  courseThumbnail,
  totalLessonsInCourse
}: LessonProgressTrackerProps) {
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const hasMarkedStart = useRef(false)
  
  // Mark lesson as started on mount
  useEffect(() => {
    if (hasMarkedStart.current) return
    hasMarkedStart.current = true
    
    // Check if already completed
    const existingProgress = getProgress()
    const existing = existingProgress.lessons[lessonId]
    if (existing) {
      setProgress(existing.progress)
      setIsCompleted(existing.completed)
    }
    
    markLessonStarted(
      lessonId,
      lessonSlug,
      lessonTitle,
      courseSlug,
      courseTitle,
      courseThumbnail,
      totalLessonsInCourse
    )
  }, [lessonId, lessonSlug, lessonTitle, courseSlug, courseTitle, courseThumbnail, totalLessonsInCourse])
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      // Calculate how far we've scrolled through the document
      const scrollProgress = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
      const clampedProgress = Math.min(100, Math.max(0, scrollProgress))
      
      if (clampedProgress > progress) {
        setProgress(clampedProgress)
        
        // Update storage
        updateLessonProgress(
          lessonId,
          lessonSlug,
          lessonTitle,
          courseSlug,
          courseTitle,
          courseThumbnail,
          clampedProgress,
          totalLessonsInCourse
        )
        
        // Check for completion
        if (clampedProgress >= 90 && !isCompleted) {
          setIsCompleted(true)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      }
    }
    
    // Debounce scroll handler
    let timeoutId: NodeJS.Timeout
    const debouncedScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }
    
    window.addEventListener('scroll', debouncedScroll)
    return () => {
      window.removeEventListener('scroll', debouncedScroll)
      clearTimeout(timeoutId)
    }
  }, [progress, isCompleted, lessonId, lessonSlug, lessonTitle, courseSlug, courseTitle, courseThumbnail, totalLessonsInCourse])
  
  return (
    <>
      {/* Progress Bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-navy-800">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Floating Progress Indicator */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300
          ${isCompleted ? 'bg-green-500/90' : 'bg-navy-800/90 backdrop-blur-sm border border-navy-700'}
        `}>
          {isCompleted ? (
            <>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">Complete!</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 relative">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-navy-600"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={75.4}
                    strokeDashoffset={75.4 - (progress / 100) * 75.4}
                    strokeLinecap="round"
                    className="text-primary-500 transition-all duration-300"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {progress}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <div className="font-bold">Lesson Complete!</div>
              <div className="text-sm text-green-100">Great progress!</div>
            </div>
            <span className="text-3xl">🎉</span>
          </div>
        </div>
      )}
      
      <div ref={contentRef} />
    </>
  )
}