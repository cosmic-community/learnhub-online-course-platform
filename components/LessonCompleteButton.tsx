'use client'

import { useState } from 'react'

interface LessonCompleteButtonProps {
  durationMinutes: number
  lessonTitle: string
}

export default function LessonCompleteButton({ durationMinutes, lessonTitle }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleComplete = () => {
    if (isCompleted) return
    
    setIsCompleted(true)
    setShowConfetti(true)
    
    // Call the global progress tracker
    const win = window as unknown as { completeLessonProgress?: (minutes: number) => void }
    if (win.completeLessonProgress) {
      win.completeLessonProgress(durationMinutes || 15)
    }
    
    // Store completion in localStorage
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]') as string[]
    if (!completedLessons.includes(lessonTitle)) {
      completedLessons.push(lessonTitle)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
    }
    
    setTimeout(() => setShowConfetti(false), 2000)
  }

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['🎉', '⭐', '✨', '🎊', '💫'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      )}
      
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
            : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">✅</span> Lesson Completed!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🎯</span> Mark Lesson as Complete
          </span>
        )}
      </button>
      
      {isCompleted && (
        <p className="text-center text-sm text-navy-400 mt-2">
          +{durationMinutes || 15} minutes added to your learning time!
        </p>
      )}
    </div>
  )
}