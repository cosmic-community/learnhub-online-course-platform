'use client'

import { useEffect } from 'react'

interface LessonTrackerProps {
  courseSlug: string
  lessonSlug: string
  lessonTitle: string
  durationMinutes?: number
}

export default function LessonTracker({ 
  courseSlug, 
  lessonSlug, 
  lessonTitle,
  durationMinutes 
}: LessonTrackerProps) {
  useEffect(() => {
    // Track that user viewed this lesson
    const savedData = localStorage.getItem('learnhub-streak')
    
    if (savedData) {
      const data = JSON.parse(savedData)
      
      // Track lessons viewed
      const viewedLessons = JSON.parse(localStorage.getItem('learnhub-lessons-viewed') || '[]')
      const lessonKey = `${courseSlug}/${lessonSlug}`
      
      if (!viewedLessons.includes(lessonKey)) {
        viewedLessons.push(lessonKey)
        localStorage.setItem('learnhub-lessons-viewed', JSON.stringify(viewedLessons))
        
        // Update streak data with lesson count
        const updatedData = {
          ...data,
          lessonsViewed: (data.lessonsViewed || 0) + 1,
          minutesLearned: (data.minutesLearned || 0) + (durationMinutes || 10),
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
      }
    }
  }, [courseSlug, lessonSlug, durationMinutes])

  // This component doesn't render anything visible
  return null
}