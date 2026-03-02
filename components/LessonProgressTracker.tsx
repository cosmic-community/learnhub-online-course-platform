'use client'

import { useState, useEffect, useCallback } from 'react'
import ConfettiCelebration from './ConfettiCelebration'
import ProgressRing from './ProgressRing'
import type { Lesson } from '@/types'

interface LessonProgressTrackerProps {
  courseSlug: string
  lessons: Lesson[]
  currentLessonSlug?: string
}

interface ProgressData {
  completedLessons: string[]
  lastUpdated: string
}

export default function LessonProgressTracker({ 
  courseSlug, 
  lessons,
  currentLessonSlug 
}: LessonProgressTrackerProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`

  // Load progress from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const data: ProgressData = JSON.parse(saved)
        setCompletedLessons(data.completedLessons)
      } catch {
        console.error('Failed to parse progress data')
      }
    }
  }, [storageKey])

  // Save progress to localStorage
  const saveProgress = useCallback((completed: string[]) => {
    const data: ProgressData = {
      completedLessons: completed,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
  }, [storageKey])

  const toggleLesson = (lessonSlug: string) => {
    const isCompleted = completedLessons.includes(lessonSlug)
    let newCompleted: string[]
    
    if (isCompleted) {
      newCompleted = completedLessons.filter(slug => slug !== lessonSlug)
      setJustCompleted(null)
    } else {
      newCompleted = [...completedLessons, lessonSlug]
      setJustCompleted(lessonSlug)
      
      // Show confetti for completing a lesson
      setShowConfetti(true)
      
      // Extra celebration if course is complete!
      if (newCompleted.length === lessons.length) {
        setTimeout(() => setShowConfetti(true), 500)
      }
    }
    
    setCompletedLessons(newCompleted)
    saveProgress(newCompleted)
  }

  const progress = lessons.length > 0 
    ? (completedLessons.length / lessons.length) * 100 
    : 0

  const isCurrentLesson = (slug: string) => slug === currentLessonSlug

  if (!mounted) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-navy-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ConfettiCelebration 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className="card p-6">
        {/* Header with Progress */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Your Progress</h3>
            <p className="text-sm text-navy-400">
              {completedLessons.length} of {lessons.length} lessons completed
            </p>
          </div>
          <ProgressRing progress={progress} />
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-400">Congratulations!</p>
                <p className="text-sm text-green-400/80">You've completed this course!</p>
              </div>
            </div>
          </div>
        )}

        {/* Lesson List */}
        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.slug)
            const isCurrent = isCurrentLesson(lesson.slug)
            const wasJustCompleted = justCompleted === lesson.slug
            
            return (
              <button
                key={lesson.id}
                onClick={() => toggleLesson(lesson.slug)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left group
                  ${isCurrent 
                    ? 'bg-primary-500/20 border border-primary-500/30' 
                    : 'hover:bg-navy-800/50 border border-transparent'
                  }
                  ${wasJustCompleted ? 'animate-pulse' : ''}
                `}
              >
                {/* Checkbox */}
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white scale-110' 
                    : 'border-2 border-navy-600 group-hover:border-primary-500'
                  }
                `}>
                  {isCompleted && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate transition-colors
                    ${isCompleted ? 'text-navy-400 line-through' : 'text-white'}
                    ${isCurrent ? 'text-primary-400' : ''}
                  `}>
                    {index + 1}. {lesson.metadata?.title || lesson.title}
                  </p>
                  {lesson.metadata?.duration_minutes && (
                    <p className="text-xs text-navy-500">
                      {lesson.metadata.duration_minutes} min
                    </p>
                  )}
                </div>

                {/* Current Indicator */}
                {isCurrent && (
                  <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Reset Progress */}
        {completedLessons.length > 0 && (
          <button
            onClick={() => {
              setCompletedLessons([])
              saveProgress([])
              setJustCompleted(null)
            }}
            className="mt-4 text-xs text-navy-500 hover:text-navy-400 transition-colors"
          >
            Reset progress
          </button>
        )}
      </div>
    </>
  )
}