'use client'

import { useState } from 'react'

interface LessonCompletionButtonProps {
  lessonSlug: string
  lessonTitle: string
}

export default function LessonCompletionButton({ lessonSlug, lessonTitle }: LessonCompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    const completed = localStorage.getItem('completed-lessons')
    if (completed) {
      try {
        const lessons = JSON.parse(completed) as string[]
        return lessons.includes(lessonSlug)
      } catch {
        return false
      }
    }
    return false
  })

  const handleComplete = () => {
    if (isCompleted) return
    
    // Mark lesson as completed
    const completed = localStorage.getItem('completed-lessons')
    let lessons: string[] = []
    if (completed) {
      try {
        lessons = JSON.parse(completed) as string[]
      } catch {
        lessons = []
      }
    }
    
    if (!lessons.includes(lessonSlug)) {
      lessons.push(lessonSlug)
      localStorage.setItem('completed-lessons', JSON.stringify(lessons))
    }
    
    // Update learning stats
    const statsStr = localStorage.getItem('learnhub-stats')
    if (statsStr) {
      try {
        const stats = JSON.parse(statsStr)
        stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1
        stats.todayMinutes = (stats.todayMinutes || 0) + 10
        stats.totalMinutesLearned = (stats.totalMinutesLearned || 0) + 10
        localStorage.setItem('learnhub-stats', JSON.stringify(stats))
        
        // Trigger a re-render of the progress component
        window.dispatchEvent(new StorageEvent('storage', { key: 'learnhub-stats' }))
      } catch {
        // Ignore errors
      }
    }
    
    setIsCompleted(true)
    
    // Show a quick toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-xl">✅</span>
        <span>Lesson completed! +10 minutes</span>
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  return (
    <button
      onClick={handleComplete}
      disabled={isCompleted}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
        isCompleted 
          ? 'bg-green-500/20 text-green-400 cursor-default'
          : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
      }`}
    >
      {isCompleted ? (
        <>
          <span className="text-xl">✅</span>
          Completed
        </>
      ) : (
        <>
          <span className="text-xl">🎯</span>
          Mark as Complete
        </>
      )}
    </button>
  )
}