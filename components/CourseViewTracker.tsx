'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  slug: string
  title: string
  thumbnail?: string
}

interface ViewedCourse {
  slug: string
  title: string
  thumbnail?: string
  viewedAt: number
}

export default function CourseViewTracker({ slug, title, thumbnail }: CourseViewTrackerProps) {
  useEffect(() => {
    // Track course view in localStorage
    const stored = localStorage.getItem('learnhub-recently-viewed')
    const courses: ViewedCourse[] = stored ? JSON.parse(stored) : []
    
    // Remove this course if it exists (we'll re-add it at the top)
    const filtered = courses.filter(c => c.slug !== slug)
    
    // Add current course at the beginning
    const updated: ViewedCourse[] = [
      {
        slug,
        title,
        thumbnail,
        viewedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 10) // Keep only last 10
    
    localStorage.setItem('learnhub-recently-viewed', JSON.stringify(updated))
  }, [slug, title, thumbnail])

  // This component doesn't render anything
  return null
}