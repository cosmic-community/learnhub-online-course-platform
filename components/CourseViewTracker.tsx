'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
}

export default function CourseViewTracker({ courseSlug, courseTitle, courseThumbnail }: CourseViewTrackerProps) {
  useEffect(() => {
    // Track course view in progress data
    const storedProgress = localStorage.getItem('learnhub-progress')
    if (storedProgress) {
      const progress = JSON.parse(storedProgress)
      if (!progress.coursesViewed.includes(courseSlug)) {
        progress.coursesViewed.push(courseSlug)
        localStorage.setItem('learnhub-progress', JSON.stringify(progress))
      }
    }

    // Track in recent courses
    const storedRecent = localStorage.getItem('learnhub-recent-courses')
    const recentCourses = storedRecent ? JSON.parse(storedRecent) : []
    
    // Remove if already exists
    const filtered = recentCourses.filter((c: { slug: string }) => c.slug !== courseSlug)
    
    // Add to beginning
    const updated = [
      {
        slug: courseSlug,
        title: courseTitle,
        thumbnail: courseThumbnail,
        viewedAt: Date.now()
      },
      ...filtered
    ].slice(0, 10) // Keep only last 10
    
    localStorage.setItem('learnhub-recent-courses', JSON.stringify(updated))
  }, [courseSlug, courseTitle, courseThumbnail])

  return null
}