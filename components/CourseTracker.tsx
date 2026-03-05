'use client'

import { useEffect } from 'react'

interface CourseTrackerProps {
  courseSlug: string
}

export default function CourseTracker({ courseSlug }: CourseTrackerProps) {
  useEffect(() => {
    // Track this course view
    const stored = localStorage.getItem('learnhub-recent-courses')
    const recentCourses = stored ? JSON.parse(stored) : []
    
    // Remove existing entry for this course if present
    const filtered = recentCourses.filter((c: { slug: string }) => c.slug !== courseSlug)
    
    // Add new entry at the beginning
    filtered.unshift({
      slug: courseSlug,
      lastVisited: Date.now()
    })
    
    // Keep only last 10 courses
    const trimmed = filtered.slice(0, 10)
    
    localStorage.setItem('learnhub-recent-courses', JSON.stringify(trimmed))
  }, [courseSlug])

  // This component doesn't render anything visible
  return null
}