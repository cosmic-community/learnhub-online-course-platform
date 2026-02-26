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
    // Track this course view
    const stored = localStorage.getItem('learnhub-recently-viewed')
    let courses: ViewedCourse[] = stored ? JSON.parse(stored) : []

    // Remove if already exists (we'll re-add with updated time)
    courses = courses.filter(c => c.slug !== slug)

    // Add to front
    courses.unshift({
      slug,
      title,
      thumbnail,
      viewedAt: Date.now(),
    })

    // Keep only last 10
    courses = courses.slice(0, 10)

    localStorage.setItem('learnhub-recently-viewed', JSON.stringify(courses))
  }, [slug, title, thumbnail])

  // This component doesn't render anything
  return null
}