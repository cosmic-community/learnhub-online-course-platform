'use client'

import { useEffect } from 'react'
import { markLessonAccessed } from '@/lib/progress'

interface LessonProgressTrackerProps {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  totalLessons: number
  courseThumbnail?: string
}

export default function LessonProgressTracker({
  courseSlug,
  courseTitle,
  lessonSlug,
  lessonTitle,
  totalLessons,
  courseThumbnail,
}: LessonProgressTrackerProps) {
  useEffect(() => {
    // Mark this lesson as accessed when the component mounts
    markLessonAccessed(
      courseSlug,
      courseTitle,
      lessonSlug,
      lessonTitle,
      totalLessons,
      courseThumbnail
    )
  }, [courseSlug, courseTitle, lessonSlug, lessonTitle, totalLessons, courseThumbnail])
  
  // This component doesn't render anything visible
  return null
}