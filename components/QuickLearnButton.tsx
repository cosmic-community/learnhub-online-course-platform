'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickLearnButtonProps {
  courses: Course[]
}

export default function QuickLearnButton({ courses }: QuickLearnButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<{
    courseName: string
    courseSlug: string
    lessonTitle: string
    lessonSlug: string
  } | null>(null)

  const handleQuickLearn = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedLesson(null)
    
    // Collect all lessons from all courses
    const allLessons: {
      courseName: string
      courseSlug: string
      lessonTitle: string
      lessonSlug: string
    }[] = []
    
    courses.forEach(course => {
      const lessons = course.metadata?.lessons || []
      lessons.forEach(lesson => {
        allLessons.push({
          courseName: course.metadata?.title || course.title,
          courseSlug: course.slug,
          lessonTitle: lesson.metadata?.title || lesson.title,
          lessonSlug: lesson.slug,
        })
      })
    })
    
    if (allLessons.length === 0) {
      setIsSpinning(false)
      return
    }
    
    // Simulate spinning
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allLessons.length)
      setSelectedLesson(allLessons[randomIndex])
      setIsSpinning(false)
    }, 1000)
  }

  return (
    <div className="relative">
      <button
        onClick={handleQuickLearn}
        disabled={isSpinning}
        className="btn-secondary text-lg group flex items-center gap-2"
      >
        <span className={`transition-transform duration-1000 inline-block ${isSpinning ? 'animate-spin' : 'group-hover:rotate-12'}`}>
          🎲
        </span>
        {isSpinning ? 'Finding a lesson...' : 'Quick Learn'}
      </button>
      
      {selectedLesson && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-80 bg-navy-900 border border-navy-700 rounded-xl p-4 shadow-2xl z-50 animate-pop-in">
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-navy-400 text-sm mb-1">How about this lesson?</div>
            <div className="text-white font-semibold mb-1">{selectedLesson.lessonTitle}</div>
            <div className="text-navy-400 text-xs mb-4">from {selectedLesson.courseName}</div>
            <div className="flex gap-2 justify-center">
              <Link
                href={`/courses/${selectedLesson.courseSlug}/lessons/${selectedLesson.lessonSlug}`}
                className="btn-primary text-sm py-2 px-4"
              >
                Start Learning
              </Link>
              <button
                onClick={handleQuickLearn}
                className="btn-secondary text-sm py-2 px-4"
              >
                Try Again
              </button>
            </div>
          </div>
          <button
            onClick={() => setSelectedLesson(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}