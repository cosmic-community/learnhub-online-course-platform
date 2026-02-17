'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseSlug: string
  courseTitle: string
}

interface RecentCourse {
  slug: string
  title: string
  timestamp: number
}

export default function CourseViewTracker({ courseSlug, courseTitle }: CourseViewTrackerProps) {
  useEffect(() => {
    // Track this course view
    const stored = localStorage.getItem('learnhub-recent')
    let recent: RecentCourse[] = stored ? JSON.parse(stored) : []
    
    // Remove if already exists
    recent = recent.filter(r => r.slug !== courseSlug)
    
    // Add to front
    recent.unshift({
      slug: courseSlug,
      title: courseTitle,
      timestamp: Date.now()
    })
    
    // Keep only last 10
    recent = recent.slice(0, 10)
    
    localStorage.setItem('learnhub-recent', JSON.stringify(recent))
    
    // Update streak data with courses viewed
    const streakStored = localStorage.getItem('learnhub-streak')
    if (streakStored) {
      const streakData = JSON.parse(streakStored)
      if (!streakData.coursesViewed) {
        streakData.coursesViewed = []
      }
      if (!streakData.coursesViewed.includes(courseSlug)) {
        streakData.coursesViewed.push(courseSlug)
        localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
      }
    }
  }, [courseSlug, courseTitle])

  return null
}