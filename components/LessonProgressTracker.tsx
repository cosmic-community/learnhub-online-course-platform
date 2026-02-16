'use client'

import { useEffect } from 'react'

interface Props {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  progress: number
  thumbnail?: string
}

export default function LessonProgressTracker({ 
  courseSlug, 
  courseTitle, 
  lessonSlug, 
  lessonTitle, 
  progress,
  thumbnail 
}: Props) {
  useEffect(() => {
    // Save current lesson progress to localStorage
    const lastLessonData = {
      courseSlug,
      courseTitle,
      lessonSlug,
      lessonTitle,
      progress,
      thumbnail,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('learnhub_last_lesson', JSON.stringify(lastLessonData))
    
    // Update streak data - mark as active today
    const streakData = localStorage.getItem('learnhub_streak')
    if (streakData) {
      const parsed = JSON.parse(streakData)
      parsed.lastVisit = new Date().toISOString()
      localStorage.setItem('learnhub_streak', JSON.stringify(parsed))
    }
  }, [courseSlug, courseTitle, lessonSlug, lessonTitle, progress, thumbnail])
  
  // This component doesn't render anything visible
  // It just tracks progress in the background
  return null
}