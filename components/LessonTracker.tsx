'use client'

import { useEffect } from 'react'
import { trackLessonAccess } from '@/lib/progress'

interface LessonTrackerProps {
  lessonId: string
  lessonSlug: string
  courseId: string
  courseSlug: string
  courseTitle: string
  totalLessons: number
}

export default function LessonTracker({
  lessonId,
  lessonSlug,
  courseId,
  courseSlug,
  courseTitle,
  totalLessons,
}: LessonTrackerProps) {
  useEffect(() => {
    // Track that the user accessed this lesson
    trackLessonAccess(lessonId, lessonSlug, courseId, courseSlug, courseTitle, totalLessons)
  }, [lessonId, lessonSlug, courseId, courseSlug, courseTitle, totalLessons])

  // This component doesn't render anything visible
  return null
}