'use client'

import { useEffect } from 'react'

const STREAK_STORAGE_KEY = 'learnhub-streak-data'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  coursesViewed: string[]
}

interface CourseViewTrackerProps {
  courseSlug: string
}

export default function CourseViewTracker({ courseSlug }: CourseViewTrackerProps) {
  useEffect(() => {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    if (stored) {
      try {
        const data: StreakData = JSON.parse(stored)
        if (!data.coursesViewed.includes(courseSlug)) {
          data.coursesViewed.push(courseSlug)
          localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
        }
      } catch (e) {
        console.error('Failed to track course view:', e)
      }
    }
  }, [courseSlug])

  return null // This is a tracking component, no UI
}