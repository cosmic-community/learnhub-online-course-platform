'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  slug: string
  title: string
  thumbnail?: string
}

export default function CourseViewTracker({ slug, title, thumbnail }: CourseViewTrackerProps) {
  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recent')
    const courses = stored ? JSON.parse(stored) : []
    
    // Remove existing entry for this course if present
    const filtered = courses.filter((c: { slug: string }) => c.slug !== slug)
    
    // Add new entry at the beginning
    const updated = [
      { slug, title, thumbnail, viewedAt: Date.now() },
      ...filtered
    ].slice(0, 10) // Keep only last 10 viewed courses
    
    localStorage.setItem('learnhub-recent', JSON.stringify(updated))
  }, [slug, title, thumbnail])

  return null // This component only tracks, doesn't render anything
}