'use client'

import { useEffect } from 'react'

interface CourseViewTrackerProps {
  courseId: string
  courseSlug: string
  courseTitle: string
  thumbnail?: string
  difficulty?: string
}

export default function CourseViewTracker({ 
  courseId, 
  courseSlug, 
  courseTitle, 
  thumbnail,
  difficulty 
}: CourseViewTrackerProps) {
  useEffect(() => {
    // Track this course view
    const stored = localStorage.getItem('learnhub-recently-viewed')
    const viewed = stored ? JSON.parse(stored) : []
    
    // Remove if already exists
    const filtered = viewed.filter((c: { id: string }) => c.id !== courseId)
    
    // Add to front
    const newViewed = {
      id: courseId,
      slug: courseSlug,
      title: courseTitle,
      thumbnail: thumbnail,
      difficulty: difficulty,
      viewedAt: new Date().toISOString()
    }
    
    filtered.unshift(newViewed)
    
    // Keep only last 10
    const trimmed = filtered.slice(0, 10)
    localStorage.setItem('learnhub-recently-viewed', JSON.stringify(trimmed))
    
    // Also trigger confetti if this is the user's first course view
    const viewCount = localStorage.getItem('learnhub-course-views')
    const newCount = viewCount ? parseInt(viewCount) + 1 : 1
    localStorage.setItem('learnhub-course-views', newCount.toString())
    
    // Celebrate milestones
    if (newCount === 1 || newCount === 5 || newCount === 10 || newCount % 25 === 0) {
      triggerMiniCelebration()
    }
  }, [courseId, courseSlug, courseTitle, thumbnail, difficulty])

  const triggerMiniCelebration = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
    const confettiCount = 20
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = (40 + Math.random() * 20) + 'vw' // Center-ish
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's'
      confetti.style.animationDelay = Math.random() * 0.3 + 's'
      document.body.appendChild(confetti)
      
      setTimeout(() => confetti.remove(), 3000)
    }
  }

  return null // This is a utility component, no UI
}