'use client'

import { useEffect } from 'react'
import { recordLessonAccess } from '@/lib/progress'

interface LessonAccessTrackerProps {
  lessonId: string
  courseId: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  totalLessons: number
}

export default function LessonAccessTracker({
  lessonId,
  courseId,
  courseSlug,
  courseTitle,
  courseThumbnail,
  totalLessons,
}: LessonAccessTrackerProps) {
  useEffect(() => {
    // Record that this lesson was accessed
    recordLessonAccess(
      lessonId,
      courseId,
      courseSlug,
      courseTitle,
      courseThumbnail,
      totalLessons
    )
  }, [lessonId, courseId, courseSlug, courseTitle, courseThumbnail, totalLessons])

  // This component doesn't render anything
  return null
}