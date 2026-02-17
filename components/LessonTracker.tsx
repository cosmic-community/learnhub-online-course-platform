'use client'

import { useEffect, useState } from 'react'
import { trackLessonView } from './LearningProgress'

interface LessonTrackerProps {
  lessonSlug: string
  courseSlug: string
  durationMinutes?: number
}

export default function LessonTracker({ lessonSlug, courseSlug, durationMinutes = 5 }: LessonTrackerProps) {
  const [tracked, setTracked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if already tracked this session
    const sessionKey = `tracked_${lessonSlug}`
    if (sessionStorage.getItem(sessionKey)) {
      setTracked(true)
      return
    }

    // Track after 10 seconds of viewing (to ensure they're actually reading)
    const timer = setTimeout(() => {
      trackLessonView(lessonSlug, courseSlug, durationMinutes)
      sessionStorage.setItem(sessionKey, 'true')
      setTracked(true)
      setShowCelebration(true)
      
      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 3000)
    }, 10000)

    return () => clearTimeout(timer)
  }, [lessonSlug, courseSlug, durationMinutes])

  if (!showCelebration) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="text-xl animate-bounce">✨</span>
        <span className="font-semibold">Lesson progress saved!</span>
        <span className="text-xl animate-bounce">📚</span>
      </div>
    </div>
  )
}