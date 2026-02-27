'use client'

import { useEffect } from 'react'

interface CourseProgressTrackerProps {
  courseSlug: string
  courseTitle: string
  thumbnail?: string
}

export default function CourseProgressTracker({ 
  courseSlug, 
  courseTitle,
  thumbnail 
}: CourseProgressTrackerProps) {
  useEffect(() => {
    // Track this course view in localStorage
    const saved = localStorage.getItem('learnhub_recent')
    const courses = saved ? JSON.parse(saved) : []
    
    // Remove if exists and add to front
    const filtered = courses.filter((c: { slug: string }) => c.slug !== courseSlug)
    const updated = [
      {
        slug: courseSlug,
        title: courseTitle,
        thumbnail: thumbnail,
        lastViewed: Date.now(),
        progress: Math.floor(Math.random() * 60) + 10 // Simulated progress for demo
      },
      ...filtered
    ].slice(0, 10) // Keep max 10 recent courses
    
    localStorage.setItem('learnhub_recent', JSON.stringify(updated))
  }, [courseSlug, courseTitle, thumbnail])

  return null // This is just a tracking component
}