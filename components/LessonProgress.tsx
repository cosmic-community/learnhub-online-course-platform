'use client'

import { useEffect, useState, useCallback } from 'react'
import { 
  loadProgress, 
  saveProgress, 
  markLessonComplete, 
  markLessonIncomplete,
  type UserProgress 
} from '@/lib/progress'
import Confetti from './Confetti'

interface LessonProgressProps {
  lessonId: string
  courseSlug: string
  lessonTitle: string
}

export default function LessonProgress({ lessonId, courseSlug, lessonTitle }: LessonProgressProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const isCompleted = progress?.lessonProgress[lessonId]?.completed ?? false

  const handleToggleComplete = useCallback(() => {
    if (!progress) return

    if (isCompleted) {
      const newProgress = markLessonIncomplete(progress, lessonId)
      setProgress(newProgress)
      saveProgress(newProgress)
      setJustCompleted(false)
    } else {
      const newProgress = markLessonComplete(progress, lessonId, courseSlug)
      setProgress(newProgress)
      saveProgress(newProgress)
      setShowConfetti(true)
      setJustCompleted(true)
      
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [progress, isCompleted, lessonId, courseSlug])

  if (!progress) {
    return (
      <div className="animate-pulse h-14 bg-navy-800 rounded-lg" />
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
        isCompleted 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
          : 'bg-navy-800/50 border border-navy-700 hover:border-navy-600'
      }`}>
        <button
          onClick={handleToggleComplete}
          className="w-full p-4 flex items-center gap-4 text-left transition-all group"
        >
          {/* Checkbox */}
          <div className={`relative flex-shrink-0 w-7 h-7 rounded-lg border-2 transition-all duration-300 ${
            isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-navy-600 group-hover:border-primary-500'
          }`}>
            {isCompleted && (
              <svg 
                className="absolute inset-0 w-full h-full p-1 text-white animate-scale-in" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium transition-colors ${
              isCompleted ? 'text-green-400' : 'text-white'
            }`}>
              {isCompleted ? 'Lesson completed!' : 'Mark lesson as complete'}
            </p>
            <p className="text-sm text-navy-400 truncate">
              {lessonTitle}
            </p>
          </div>

          {/* Badge */}
          {isCompleted && (
            <div className={`flex-shrink-0 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-medium ${
              justCompleted ? 'animate-bounce-once' : ''
            }`}>
              ✨ Done
            </div>
          )}
        </button>

        {/* Progress bar animation on complete */}
        {justCompleted && (
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-progress-bar" />
        )}
      </div>
    </>
  )
}