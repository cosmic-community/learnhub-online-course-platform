'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface LessonCompleteProps {
  courseSlug: string
  nextLessonSlug?: string
  nextLessonTitle?: string
}

export default function LessonComplete({ 
  courseSlug, 
  nextLessonSlug, 
  nextLessonTitle 
}: LessonCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleComplete = () => {
    setShowConfetti(true)
    setIsCompleted(true)
    
    // Track completed lessons in localStorage
    const completed = JSON.parse(localStorage.getItem('learnhub-completed') || '[]')
    const lessonKey = `${courseSlug}-${window.location.pathname}`
    if (!completed.includes(lessonKey)) {
      completed.push(lessonKey)
      localStorage.setItem('learnhub-completed', JSON.stringify(completed))
    }
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="mt-12 pt-8 border-t border-navy-700">
        {!isCompleted ? (
          <div className="text-center">
            <p className="text-navy-300 mb-4">Finished this lesson?</p>
            <button
              onClick={handleComplete}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105"
            >
              <span className="text-xl">✅</span>
              <span>Mark as Complete</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 text-[10px] flex items-center justify-center">🎁</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-green-400">✓</span>
              <span className="text-green-400 font-medium">Lesson Completed!</span>
            </div>
            
            {nextLessonSlug && (
              <div>
                <p className="text-navy-400 mb-3">Ready for the next lesson?</p>
                <Link
                  href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                  className="inline-flex items-center gap-2 btn-primary group"
                >
                  <span>Continue: {nextLessonTitle}</span>
                  <svg 
                    className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}