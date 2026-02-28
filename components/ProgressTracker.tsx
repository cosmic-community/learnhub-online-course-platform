'use client'

import { useEffect } from 'react'

interface ProgressTrackerProps {
  type: 'course' | 'lesson' | 'category'
  id: string
}

export default function ProgressTracker({ type, id }: ProgressTrackerProps) {
  useEffect(() => {
    // Load current progress
    const stored = localStorage.getItem('learnhub-progress')
    if (!stored) return

    const progress = JSON.parse(stored)
    let updated = false

    switch (type) {
      case 'course':
        if (!progress.coursesViewed.includes(id)) {
          progress.coursesViewed.push(id)
          progress.totalXP += 15 // XP for viewing a new course
          updated = true
        }
        break
      case 'lesson':
        if (!progress.lessonsCompleted.includes(id)) {
          progress.lessonsCompleted.push(id)
          progress.totalXP += 25 // XP for viewing a lesson
          updated = true
        }
        break
      case 'category':
        if (!progress.categoriesExplored.includes(id)) {
          progress.categoriesExplored.push(id)
          progress.totalXP += 10 // XP for exploring a category
          updated = true
        }
        break
    }

    if (updated) {
      localStorage.setItem('learnhub-progress', JSON.stringify(progress))
    }
  }, [type, id])

  return null // This is a tracker component, no UI
}