'use client'

import { useEffect } from 'react'

interface LessonProgressProps {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  totalLessons: number
  currentLessonIndex: number
}

interface RecentCourse {
  slug: string
  title: string
  lastLesson?: string
  progress: number
}

export default function LessonProgress({ 
  courseSlug, 
  courseTitle, 
  lessonSlug, 
  totalLessons, 
  currentLessonIndex 
}: LessonProgressProps) {
  useEffect(() => {
    // Track this lesson view
    const viewedKey = 'learnhub-lessons-viewed'
    const stored = localStorage.getItem(viewedKey)
    const viewed: string[] = stored ? JSON.parse(stored) : []
    
    const lessonKey = `${courseSlug}:${lessonSlug}`
    if (!viewed.includes(lessonKey)) {
      viewed.push(lessonKey)
      localStorage.setItem(viewedKey, JSON.stringify(viewed))
    }

    // Update recent courses
    const recentKey = 'learnhub-recent-courses'
    const recentStored = localStorage.getItem(recentKey)
    const recent: RecentCourse[] = recentStored ? JSON.parse(recentStored) : []
    
    // Calculate progress for this course
    const courseViewedLessons = viewed.filter(v => v.startsWith(`${courseSlug}:`)).length
    const progress = Math.round((courseViewedLessons / totalLessons) * 100)
    
    // Update or add this course to recent
    const existingIndex = recent.findIndex(r => r.slug === courseSlug)
    const courseData: RecentCourse = {
      slug: courseSlug,
      title: courseTitle,
      lastLesson: lessonSlug,
      progress: Math.min(progress, 100),
    }
    
    if (existingIndex >= 0) {
      recent.splice(existingIndex, 1)
    }
    recent.unshift(courseData)
    
    // Keep only last 5
    localStorage.setItem(recentKey, JSON.stringify(recent.slice(0, 5)))
  }, [courseSlug, courseTitle, lessonSlug, totalLessons])

  // This component doesn't render anything visible
  // It just tracks progress in localStorage
  return null
}