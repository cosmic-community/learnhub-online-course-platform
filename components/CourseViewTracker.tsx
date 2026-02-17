'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  slug: string
}

export default function CourseViewTracker({ slug }: CourseViewTrackerProps) {
  useEffect(() => {
    const stored = localStorage.getItem('recently-viewed')
    const viewed: { slug: string; viewedAt: number }[] = stored ? JSON.parse(stored) : []

    // Remove existing entry for this course
    const filtered = viewed.filter((v) => v.slug !== slug)

    // Add new entry at the beginning
    filtered.unshift({ slug, viewedAt: Date.now() })

    // Keep only last 10 viewed courses
    const trimmed = filtered.slice(0, 10)

    localStorage.setItem('recently-viewed', JSON.stringify(trimmed))
  }, [slug])

  return null
}