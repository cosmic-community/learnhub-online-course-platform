'use client'

import { useEffect } from 'react'

interface LessonTrackerProps {
  courseSlug: string
}

export default function LessonTracker({ courseSlug }: LessonTrackerProps) {
  useEffect(() => {
    // Track last visited course
    localStorage.setItem('learnhub-last-course', courseSlug)
  }, [courseSlug])

  return null
}