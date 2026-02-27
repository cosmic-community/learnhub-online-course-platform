'use client'

import { useState, useEffect } from 'react'

interface LessonCompleteButtonProps {
  courseId: string
  lessonId: string
  lessonTitle: string
}

export default function LessonCompleteButton({ 
  courseId, 
  lessonId, 
  lessonTitle 
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`progress-${courseId}`)
    if (stored) {
      const completed = JSON.parse(stored) as string[]
      setIsCompleted(completed.includes(lessonId))
    }
  }, [courseId, lessonId])

  const toggleComplete = () => {
    const stored = localStorage.getItem(`progress-${courseId}`)
    let completed: string[] = stored ? JSON.parse(stored) : []
    
    if (isCompleted) {
      completed = completed.filter(id => id !== lessonId)
    } else {
      completed.push(lessonId)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
    
    localStorage.setItem(`progress-${courseId}`, JSON.stringify(completed))
    setIsCompleted(!isCompleted)
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('progress-updated', { 
      detail: { courseId, lessonId, completed: !isCompleted } 
    }))
  }

  return (
    <button
      onClick={toggleComplete}
      className={`relative group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        isCompleted
          ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40 hover:bg-green-500/30'
          : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
      }`}
    >
      {/* Confetti burst effect */}
      {showConfetti && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'][i % 4],
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </span>
      )}
      
      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-500 border-green-500' 
          : 'border-current group-hover:border-white'
      }`}>
        {isCompleted && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      
      {isCompleted ? 'Completed!' : 'Mark as Complete'}
    </button>
  )
}