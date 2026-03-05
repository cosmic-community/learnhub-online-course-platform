'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseSlug: string
  courseTitle: string
}

export default function CourseViewTracker({ courseSlug, courseTitle }: CourseViewTrackerProps) {
  useEffect(() => {
    const data = {
      slug: courseSlug,
      title: courseTitle,
      timestamp: Date.now()
    }
    localStorage.setItem('last-viewed-course', JSON.stringify(data))
  }, [courseSlug, courseTitle])

  return null
}