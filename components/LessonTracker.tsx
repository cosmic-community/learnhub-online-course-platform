'use client'

import { useEffect, useState } from 'react'
import { trackLessonView } from './LearningStreak'

interface LessonTrackerProps {
  lessonSlug: string
  lessonTitle: string
}

export default function LessonTracker({ lessonSlug, lessonTitle }: LessonTrackerProps) {
  const [isTracked, setIsTracked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if this lesson was already viewed
    const saved = localStorage.getItem('learnhub-progress')
    if (saved) {
      const progress = JSON.parse(saved)
      if (progress.viewedLessons?.includes(lessonSlug)) {
        setIsTracked(true)
        return
      }
    }
    
    // Track this lesson view after a short delay (to ensure user actually looks at content)
    const timer = setTimeout(() => {
      trackLessonView(lessonSlug)
      setIsTracked(true)
      setShowCelebration(true)
      
      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 3000)
    }, 5000) // Track after 5 seconds of viewing
    
    return () => clearTimeout(timer)
  }, [lessonSlug])

  return (
    <>
      {/* Completion indicator */}
      <div className={`fixed bottom-24 right-5 transition-all duration-500 ${isTracked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-green-500/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
          <span className="text-lg">✓</span>
          <span>Lesson tracked!</span>
        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-navy-900/90 backdrop-blur-sm rounded-2xl p-8 text-center animate-bounce-in shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Great Progress!</h3>
            <p className="text-navy-300">You&apos;ve completed &quot;{lessonTitle}&quot;</p>
          </div>
        </div>
      )}
    </>
  )
}