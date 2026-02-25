'use client'

import { useEffect } from 'react'
import { trackCourseView } from './LearningProgress'

interface CourseViewTrackerProps {
  courseSlug: string
}

export default function CourseViewTracker({ courseSlug }: CourseViewTrackerProps) {
  useEffect(() => {
    trackCourseView(courseSlug)
  }, [courseSlug])

  return null
}