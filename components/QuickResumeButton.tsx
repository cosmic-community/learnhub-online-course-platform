'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickResumeButtonProps {
  courses: Course[]
}

interface LastLesson {
  courseSlug: string
  lessonSlug: string
  courseTitle: string
  lessonTitle: string
  timestamp: string
}

export default function QuickResumeButton({ courses }: QuickResumeButtonProps) {
  const [lastLesson, setLastLesson] = useState<LastLesson | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('learnhub-last-lesson')
    if (saved) {
      const parsed = JSON.parse(saved) as LastLesson
      // Only show if viewed in the last 7 days
      const daysSinceView = (Date.now() - new Date(parsed.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceView < 7) {
        setLastLesson(parsed)
        // Show button after scroll
        const handleScroll = () => {
          setIsVisible(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [courses])

  if (!lastLesson || !isVisible) return null

  return (
    <div 
      className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/courses/${lastLesson.courseSlug}/lessons/${lastLesson.lessonSlug}`}
        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <div className="text-xs text-primary-100 whitespace-nowrap">Continue learning</div>
          <div className="text-sm font-medium whitespace-nowrap">{lastLesson.lessonTitle}</div>
        </div>
        {!isHovered && (
          <span className="text-sm font-medium">Resume</span>
        )}
      </Link>
    </div>
  )
}