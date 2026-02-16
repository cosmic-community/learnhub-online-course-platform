'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LastLesson {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  progress: number
  thumbnail?: string
  timestamp: string
}

export default function ContinueLearning() {
  const [lastLesson, setLastLesson] = useState<LastLesson | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('learnhub_last_lesson')
    if (saved) {
      setLastLesson(JSON.parse(saved))
    }
  }, [])

  if (!lastLesson) {
    return (
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <span className="text-3xl">🎯</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Ready to start learning?</h3>
            <p className="text-navy-400 text-sm">Browse our courses and begin your journey!</p>
          </div>
          <Link href="/courses" className="btn-primary">
            Explore Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden bg-gradient-to-br from-primary-500/10 to-navy-900/50 border-primary-500/20">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            {lastLesson.thumbnail ? (
              <img 
                src={`${lastLesson.thumbnail}?w=160&h=160&fit=crop&auto=format,compress`}
                alt={lastLesson.courseTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
            )}
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary-400 text-xs font-medium uppercase tracking-wider">Continue Learning</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 truncate">{lastLesson.courseTitle}</h3>
            <p className="text-navy-400 text-sm truncate">📖 {lastLesson.lessonTitle}</p>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-navy-400">Progress</span>
                <span className="text-primary-400 font-medium">{lastLesson.progress}%</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${lastLesson.progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <Link 
            href={`/courses/${lastLesson.courseSlug}/lessons/${lastLesson.lessonSlug}`}
            className="btn-primary flex-shrink-0 hidden sm:flex"
          >
            Resume
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {/* Mobile Resume Button */}
        <Link 
          href={`/courses/${lastLesson.courseSlug}/lessons/${lastLesson.lessonSlug}`}
          className="btn-primary w-full mt-4 sm:hidden"
        >
          Resume Learning
        </Link>
      </div>
    </div>
  )
}

// Helper function to save progress (export for use in lesson pages)
export function saveLastLesson(data: LastLesson): void {
  localStorage.setItem('learnhub_last_lesson', JSON.stringify(data))
  
  // Also update total lessons completed for streak
  const streakData = localStorage.getItem('learnhub_streak')
  if (streakData) {
    const parsed = JSON.parse(streakData)
    parsed.totalLessonsCompleted = (parsed.totalLessonsCompleted || 0) + 1
    localStorage.setItem('learnhub_streak', JSON.stringify(parsed))
  }
}