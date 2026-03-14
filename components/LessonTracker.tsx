'use client'

import { useEffect, useRef } from 'react'

interface LessonTrackerProps {
  lessonSlug: string
}

export default function LessonTracker({ lessonSlug }: LessonTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    // Track lesson view
    const viewedLessons = JSON.parse(localStorage.getItem('learnhub-viewed-lessons') || '[]')
    
    if (!viewedLessons.includes(lessonSlug)) {
      viewedLessons.push(lessonSlug)
      localStorage.setItem('learnhub-viewed-lessons', JSON.stringify(viewedLessons))
      
      // Update streak data
      const streakData = localStorage.getItem('learnhub-streak')
      if (streakData) {
        const data = JSON.parse(streakData)
        data.lessonsViewed = (data.lessonsViewed || 0) + 1
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    }
  }, [lessonSlug])

  return null
}