'use client'

import Link from 'next/link'
import { markCourseStarted } from './LearningProgress'

interface StartLearningButtonProps {
  courseSlug: string
  firstLessonSlug?: string
  className?: string
}

export default function StartLearningButton({ 
  courseSlug, 
  firstLessonSlug,
  className = ''
}: StartLearningButtonProps) {
  const handleClick = () => {
    markCourseStarted(courseSlug)
  }

  const href = firstLessonSlug 
    ? `/courses/${courseSlug}/lessons/${firstLessonSlug}`
    : `/courses/${courseSlug}`

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`btn-primary group relative overflow-hidden ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        Start Learning
        <svg 
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}