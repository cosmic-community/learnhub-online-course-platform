'use client'

import { useEffect } from 'react'
import type { Course } from '@/types'

interface CourseViewTrackerProps {
  course: Course
}

export default function CourseViewTracker({ course }: CourseViewTrackerProps) {
  useEffect(() => {
    const trackView = () => {
      const stored = localStorage.getItem('learnhub-recent-courses')
      let recent: Array<{
        slug: string
        title: string
        lastViewed: string
        progress?: number
      }> = stored ? JSON.parse(stored) : []

      // Remove if already exists
      recent = recent.filter(r => r.slug !== course.slug)

      // Add to front
      recent.unshift({
        slug: course.slug,
        title: course.metadata?.title || course.title,
        lastViewed: new Date().toISOString(),
        progress: 0
      })

      // Keep only last 10
      recent = recent.slice(0, 10)

      localStorage.setItem('learnhub-recent-courses', JSON.stringify(recent))
    }

    trackView()
  }, [course.slug, course.title, course.metadata?.title])

  return null
}