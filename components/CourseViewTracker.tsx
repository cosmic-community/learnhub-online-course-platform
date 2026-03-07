'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseSlug: string
}

export default function CourseViewTracker({ courseSlug }: CourseViewTrackerProps) {
  useEffect(() => {
    // Track viewed courses
    const stored = localStorage.getItem('learnhub-viewed-courses')
    const viewedCourses: string[] = stored ? JSON.parse(stored) : []
    
    if (!viewedCourses.includes(courseSlug)) {
      viewedCourses.push(courseSlug)
      localStorage.setItem('learnhub-viewed-courses', JSON.stringify(viewedCourses))
    }
  }, [courseSlug])

  return null
}