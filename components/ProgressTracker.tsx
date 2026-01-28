'use client'

import { useState, useEffect } from 'react'

interface ProgressTrackerProps {
  courseSlug: string
  totalLessons: number
  lessonSlugs: string[]
}

export default function ProgressTracker({ courseSlug, totalLessons, lessonSlugs }: ProgressTrackerProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  
  useEffect(() => {
    // Load progress from localStorage
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    if (stored) {
      const parsed = JSON.parse(stored) as string[]
      setCompletedLessons(parsed)
    }
  }, [courseSlug])
  
  const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0
  const isComplete = completedLessons.length === totalLessons && totalLessons > 0
  
  const toggleLesson = (lessonSlug: string) => {
    setCompletedLessons(prev => {
      const updated = prev.includes(lessonSlug)
        ? prev.filter(s => s !== lessonSlug)
        : [...prev, lessonSlug]
      
      localStorage.setItem(`course-progress-${courseSlug}`, JSON.stringify(updated))
      
      // Check if course just completed
      if (updated.length === totalLessons && !prev.includes(lessonSlug)) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 4000)
      }
      
      return updated
    })
  }
  
  return (
    <div className="relative">
      {/* Confetti Celebration */}
      {showCelebration && <ConfettiCelebration />}
      
      {/* Progress Bar */}
      <div className="bg-navy-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-xl">📊</span>
            Your Progress
          </h3>
          <span className="text-primary-400 font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="h-3 bg-navy-700 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm text-navy-400">
          <span>{completedLessons.length} of {totalLessons} lessons completed</span>
          {isComplete && (
            <span className="text-primary-400 flex items-center gap-1">
              <span>🎉</span> Course Complete!
            </span>
          )}
        </div>
      </div>
      
      {/* Lesson Checklist */}
      <div className="space-y-2">
        {lessonSlugs.map((slug, index) => {
          const isCompleted = completedLessons.includes(slug)
          return (
            <button
              key={slug}
              onClick={() => toggleLesson(slug)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left group ${
                isCompleted 
                  ? 'bg-primary-500/10 border border-primary-500/30' 
                  : 'bg-navy-800/50 border border-navy-700 hover:border-navy-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isCompleted 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-navy-700 text-navy-400 group-hover:bg-navy-600'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${isCompleted ? 'text-primary-300' : 'text-navy-300'}`}>
                Mark as {isCompleted ? 'incomplete' : 'complete'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ConfettiCelebration() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
    duration: number
  }>>([])
  
  useEffect(() => {
    const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#22c55e', '#ec4899']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Celebration Message */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
        <div className="bg-navy-900/95 backdrop-blur-lg border border-primary-500/50 rounded-2xl px-8 py-6 shadow-2xl shadow-primary-500/20">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-primary-400">You completed this course!</p>
        </div>
      </div>
      
      {/* Confetti Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}