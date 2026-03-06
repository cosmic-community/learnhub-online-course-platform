'use client'

import { useEffect } from 'react'

interface LessonTrackerProps {
  lessonSlug: string
}

export default function LessonTracker({ lessonSlug }: LessonTrackerProps) {
  useEffect(() => {
    // Debounce to prevent multiple tracking
    const viewedLessons = JSON.parse(localStorage.getItem('viewed-lessons') || '{}')
    const today = new Date().toDateString()
    const lessonKey = `${lessonSlug}-${today}`
    
    if (!viewedLessons[lessonKey]) {
      // Mark as viewed
      viewedLessons[lessonKey] = true
      localStorage.setItem('viewed-lessons', JSON.stringify(viewedLessons))
      
      // Dispatch event for streak tracker
      window.dispatchEvent(new CustomEvent('lesson-viewed', {
        detail: { lessonSlug, timestamp: Date.now() }
      }))
    }
  }, [lessonSlug])

  return null
}