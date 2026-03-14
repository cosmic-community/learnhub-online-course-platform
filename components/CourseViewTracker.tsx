'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseSlug: string
}

interface ViewedCourse {
  slug: string
  lastViewed: number
}

export default function CourseViewTracker({ courseSlug }: CourseViewTrackerProps) {
  useEffect(() => {
    const stored = localStorage.getItem('learnhub-viewed-courses')
    let viewedCourses: ViewedCourse[] = stored ? JSON.parse(stored) : []
    
    // Remove existing entry for this course
    viewedCourses = viewedCourses.filter(c => c.slug !== courseSlug)
    
    // Add to beginning (most recent)
    viewedCourses.unshift({
      slug: courseSlug,
      lastViewed: Date.now()
    })
    
    // Keep only last 10 viewed courses
    viewedCourses = viewedCourses.slice(0, 10)
    
    localStorage.setItem('learnhub-viewed-courses', JSON.stringify(viewedCourses))
  }, [courseSlug])

  return null
}