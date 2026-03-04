'use client'

import { useEffect } from 'react'

interface LessonTrackerProps {
  courseSlug: string
  lessonSlug: string
  courseTitle: string
  lessonTitle: string
}

export default function LessonTracker({ courseSlug, lessonSlug, courseTitle, lessonTitle }: LessonTrackerProps) {
  useEffect(() => {
    // Save this as the last viewed lesson for "Resume" functionality
    const lastLesson = {
      courseSlug,
      lessonSlug,
      courseTitle,
      lessonTitle,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('learnhub-last-lesson', JSON.stringify(lastLesson))

    // Also track that user has started this course
    const progress = localStorage.getItem('learnhub-progress')
    if (progress) {
      const parsed = JSON.parse(progress)
      if (!parsed.startedCourses.includes(courseSlug)) {
        parsed.startedCourses.push(courseSlug)
        localStorage.setItem('learnhub-progress', JSON.stringify(parsed))
      }
    }
  }, [courseSlug, lessonSlug, courseTitle, lessonTitle])

  // This component doesn't render anything visible
  return null
}