'use client'

import { useEffect } from 'react'

interface CourseProgressTrackerProps {
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  lessonSlug?: string
  lessonTitle?: string
}

export default function CourseProgressTracker({ 
  courseSlug, 
  courseTitle, 
  courseThumbnail,
  lessonSlug,
  lessonTitle 
}: CourseProgressTrackerProps) {
  useEffect(() => {
    // Update recent courses in localStorage
    const stored = localStorage.getItem('learnhub_recent')
    let recentCourses: Array<{
      slug: string
      title: string
      thumbnail?: string
      lastLesson?: string
      lastLessonSlug?: string
      timestamp: number
    }> = []

    if (stored) {
      try {
        recentCourses = JSON.parse(stored)
      } catch {
        recentCourses = []
      }
    }

    // Remove existing entry for this course
    recentCourses = recentCourses.filter(c => c.slug !== courseSlug)

    // Add to front
    recentCourses.unshift({
      slug: courseSlug,
      title: courseTitle,
      thumbnail: courseThumbnail,
      lastLesson: lessonTitle,
      lastLessonSlug: lessonSlug,
      timestamp: Date.now(),
    })

    // Keep only last 10
    recentCourses = recentCourses.slice(0, 10)

    localStorage.setItem('learnhub_recent', JSON.stringify(recentCourses))
  }, [courseSlug, courseTitle, courseThumbnail, lessonSlug, lessonTitle])

  return null // This is an invisible tracking component
}