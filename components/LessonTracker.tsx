'use client'

import { useEffect } from 'react'
import { trackLessonView } from './LearningProgress'

export default function LessonTracker() {
  useEffect(() => {
    // Track this lesson view
    trackLessonView()
  }, [])

  return null
}