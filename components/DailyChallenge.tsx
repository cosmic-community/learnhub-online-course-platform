'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Lesson } from '@/types'

interface DailyChallengeProps {
  courses: Course[]
}

interface ChallengeData {
  courseSlug: string
  lessonSlug: string
  courseName: string
  lessonName: string
  date: string
}

export default function DailyChallenge({ courses }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const dismissed = localStorage.getItem('learnhub-challenge-dismissed')
    
    if (dismissed === today) {
      setIsDismissed(true)
      return
    }

    // Check if we already have today's challenge
    const stored = localStorage.getItem('learnhub-daily-challenge')
    if (stored) {
      const data: ChallengeData = JSON.parse(stored)
      if (data.date === today) {
        setChallenge(data)
        return
      }
    }

    // Generate new challenge for today
    if (courses.length > 0) {
      // Get all lessons from all courses
      const allLessons: { course: Course; lesson: Lesson }[] = []
      
      courses.forEach(course => {
        const lessons = course.metadata?.lessons || []
        lessons.forEach(lesson => {
          allLessons.push({ course, lesson })
        })
      })

      if (allLessons.length > 0) {
        // Use today's date as seed for consistent daily selection
        const dateNum = new Date().getDate() + new Date().getMonth() * 31
        const selectedIndex = dateNum % allLessons.length
        const selected = allLessons[selectedIndex]

        if (selected) {
          const newChallenge: ChallengeData = {
            courseSlug: selected.course.slug,
            lessonSlug: selected.lesson.slug,
            courseName: selected.course.title,
            lessonName: selected.lesson.metadata?.title || selected.lesson.title,
            date: today
          }
          setChallenge(newChallenge)
          localStorage.setItem('learnhub-daily-challenge', JSON.stringify(newChallenge))
        }
      }
    }
  }, [courses])

  const handleDismiss = () => {
    const today = new Date().toDateString()
    localStorage.setItem('learnhub-challenge-dismissed', today)
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 300)
  }

  if (isDismissed || !challenge) return null

  return (
    <div className={`
      fixed bottom-24 left-6 z-40 max-w-sm
      transition-all duration-300
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 border border-navy-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Header with animated gradient */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-transparent animate-shimmer" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold text-white">Today's Challenge</span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss challenge"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Recommended Lesson</p>
            <p className="text-white font-medium line-clamp-2">{challenge.lessonName}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-navy-400">
            <span className="text-lg">📚</span>
            <span className="line-clamp-1">{challenge.courseName}</span>
          </div>

          <Link
            href={`/courses/${challenge.courseSlug}/lessons/${challenge.lessonSlug}`}
            className="block w-full py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-center transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25"
          >
            Start Learning →
          </Link>

          <p className="text-center text-xs text-navy-500">
            Complete this to maintain your streak! 🔥
          </p>
        </div>
      </div>
    </div>
  )
}