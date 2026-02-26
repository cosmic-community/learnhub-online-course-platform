'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LastViewedLesson {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  courseThumbnail?: string
  timestamp: number
  progress: number // 0-100
}

export default function QuickResume() {
  const [lastLesson, setLastLesson] = useState<LastViewedLesson | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('learnhub-last-lesson')
    if (stored) {
      setLastLesson(JSON.parse(stored))
    }
  }, [])

  if (!isClient || !lastLesson) {
    return null
  }

  const timeAgo = getTimeAgo(lastLesson.timestamp)

  return (
    <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 border-navy-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📖</span>
        <h3 className="text-lg font-semibold text-white">Continue Learning</h3>
        <span className="text-xs text-navy-400 ml-auto">{timeAgo}</span>
      </div>
      
      <div className="flex gap-4">
        {lastLesson.courseThumbnail && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-navy-800">
            <img
              src={`${lastLesson.courseThumbnail}?w=160&h=160&fit=crop&auto=format,compress`}
              alt={lastLesson.courseTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-navy-400 truncate">{lastLesson.courseTitle}</p>
          <h4 className="text-white font-medium truncate mb-2">{lastLesson.lessonTitle}</h4>
          
          {/* Progress bar */}
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
              style={{ width: `${lastLesson.progress}%` }}
            />
          </div>
          
          <Link
            href={`/courses/${lastLesson.courseSlug}/lessons/${lastLesson.lessonSlug}`}
            className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Resume Lesson
          </Link>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(timestamp).toLocaleDateString()
}

// Export a function to save last viewed lesson
export function saveLastViewedLesson(lesson: Omit<LastViewedLesson, 'timestamp'>): void {
  const data: LastViewedLesson = {
    ...lesson,
    timestamp: Date.now(),
  }
  localStorage.setItem('learnhub-last-lesson', JSON.stringify(data))
}