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
  lessonTitle,
}: CourseProgressTrackerProps) {
  useEffect(() => {
    // Update recent courses in localStorage
    const stored = localStorage.getItem('learnhub-recent-courses')
    let recentCourses: Array<{
      slug: string
      title: string
      thumbnail?: string
      lastLesson?: string
      lastLessonSlug?: string
      visitedAt: string
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

    // Add new entry at the beginning
    recentCourses.unshift({
      slug: courseSlug,
      title: courseTitle,
      thumbnail: courseThumbnail,
      lastLesson: lessonTitle,
      lastLessonSlug: lessonSlug,
      visitedAt: new Date().toISOString(),
    })

    // Keep only last 10 courses
    recentCourses = recentCourses.slice(0, 10)

    localStorage.setItem('learnhub-recent-courses', JSON.stringify(recentCourses))
  }, [courseSlug, courseTitle, courseThumbnail, lessonSlug, lessonTitle])

  // This component doesn't render anything visible
  return null
}