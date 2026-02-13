'use client'

import { useState, useEffect } from 'react'

interface LessonCompletionButtonProps {
  lessonSlug: string
  lessonTitle: string
}

export default function LessonCompletionButton({ lessonSlug, lessonTitle }: LessonCompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const viewedLessons = JSON.parse(localStorage.getItem('learnhub_viewed_lessons') || '[]')
    setIsCompleted(viewedLessons.includes(lessonSlug))
  }, [lessonSlug])

  const toggleCompletion = () => {
    const viewedLessons = JSON.parse(localStorage.getItem('learnhub_viewed_lessons') || '[]')
    
    if (isCompleted) {
      // Remove from completed
      const updated = viewedLessons.filter((slug: string) => slug !== lessonSlug)
      localStorage.setItem('learnhub_viewed_lessons', JSON.stringify(updated))
      setIsCompleted(false)
    } else {
      // Mark as completed
      if (!viewedLessons.includes(lessonSlug)) {
        viewedLessons.push(lessonSlug)
        localStorage.setItem('learnhub_viewed_lessons', JSON.stringify(viewedLessons))
      }
      setIsCompleted(true)
      setShowParticles(true)
      
      // Trigger celebration particles
      setTimeout(() => setShowParticles(false), 1000)
    }
  }

  if (!mounted) {
    return (
      <button className="btn-secondary opacity-50" disabled>
        Loading...
      </button>
    )
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleCompletion}
        className={`
          relative overflow-hidden transition-all duration-300 transform
          ${isCompleted 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105' 
            : 'bg-navy-800 hover:bg-navy-700 text-white border border-navy-700'
          }
          px-6 py-3 rounded-lg font-semibold flex items-center gap-2
        `}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed! 🎉
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
      
      {/* Success particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: ['#14b8a6', '#22c55e', '#fbbf24', '#f472b6'][i % 4],
                left: `${50 + Math.cos((i * 30 * Math.PI) / 180) * 40}%`,
                top: `${50 + Math.sin((i * 30 * Math.PI) / 180) * 40}%`,
                animationDuration: '0.5s',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}