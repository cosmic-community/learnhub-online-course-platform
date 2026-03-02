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
  viewedAt: string
}

export default function CourseViewTracker({ slug, title, thumbnail }: CourseViewTrackerProps) {
  useEffect(() => {
    const saved = localStorage.getItem('recently-viewed-courses')
    let courses: ViewedCourse[] = saved ? JSON.parse(saved) : []

    // Remove if already exists
    courses = courses.filter(c => c.slug !== slug)

    // Add to front
    courses.unshift({
      slug,
      title,
      thumbnail,
      viewedAt: new Date().toISOString(),
    })

    // Keep only last 10
    courses = courses.slice(0, 10)

    localStorage.setItem('recently-viewed-courses', JSON.stringify(courses))
  }, [slug, title, thumbnail])

  return null
}