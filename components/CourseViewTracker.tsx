'use client'

import { useEffect } from 'react'
import { addToRecentlyViewed } from './RecentlyViewed'

interface CourseViewTrackerProps {
  slug: string
  title: string
  thumbnail?: string
}

export default function CourseViewTracker({ slug, title, thumbnail }: CourseViewTrackerProps) {
  useEffect(() => {
    // Track this course view
    addToRecentlyViewed({
      slug,
      title,
      thumbnail
    })
    
    // Update stats
    const stats = JSON.parse(localStorage.getItem('learnhub_stats') || '{}')
    stats.totalMinutesLearned = (stats.totalMinutesLearned || 0) + 2
    localStorage.setItem('learnhub_stats', JSON.stringify(stats))
    
  }, [slug, title, thumbnail])

  // This component doesn't render anything visible
  return null
}