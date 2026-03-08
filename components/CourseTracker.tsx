'use client'

import { useEffect } from 'react'
import { trackCourseStart } from './LearningProgress'

export default function CourseTracker() {
  useEffect(() => {
    // Track this course start (only once per session)
    const sessionKey = `course-tracked-${window.location.pathname}`
    if (!sessionStorage.getItem(sessionKey)) {
      trackCourseStart()
      sessionStorage.setItem(sessionKey, 'true')
    }
  }, [])

  return null
}