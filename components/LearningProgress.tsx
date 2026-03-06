'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  courseSlug: string
  lessonSlugs: string[]
  currentLessonSlug?: string
}

// Generate confetti particles
function createConfetti() {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4']
  const confettiCount = 150
  const confetti: Array<{
    x: number
    y: number
    color: string
    rotation: number
    scale: number
    velocityX: number
    velocityY: number
    rotationSpeed: number
  }> = []

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: Math.random() * 3 + 2,
      rotationSpeed: (Math.random() - 0.5) * 10,
    })
  }
  return confetti
}

export default function LearningProgress({ courseSlug, lessonSlugs, currentLessonSlug }: LearningProgressProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasShownCelebration, setHasShownCelebration] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`
  const celebrationKey = `learnhub-celebrated-${courseSlug}`

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch {
        setCompletedLessons([])
      }
    }
    // Check if celebration was already shown
    const celebrated = localStorage.getItem(celebrationKey)
    if (celebrated === 'true') {
      setHasShownCelebration(true)
    }
  }, [storageKey, celebrationKey])

  const progress = lessonSlugs.length > 0 
    ? Math.round((completedLessons.length / lessonSlugs.length) * 100)
    : 0

  const isCurrentLessonComplete = currentLessonSlug 
    ? completedLessons.includes(currentLessonSlug)
    : false

  const allComplete = lessonSlugs.length > 0 && completedLessons.length === lessonSlugs.length

  const toggleLessonComplete = useCallback((lessonSlug: string) => {
    setCompletedLessons(prev => {
      const isCompleted = prev.includes(lessonSlug)
      let newCompleted: string[]
      
      if (isCompleted) {
        newCompleted = prev.filter(s => s !== lessonSlug)
      } else {
        newCompleted = [...prev, lessonSlug]
      }
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(newCompleted))
      
      // Check if course is now complete
      if (!hasShownCelebration && newCompleted.length === lessonSlugs.length) {
        setShowConfetti(true)
        setHasShownCelebration(true)
        localStorage.setItem(celebrationKey, 'true')
        
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000)
      }
      
      return newCompleted
    })
  }, [storageKey, celebrationKey, lessonSlugs.length, hasShownCelebration])

  const resetProgress = useCallback(() => {
    setCompletedLessons([])
    setHasShownCelebration(false)
    localStorage.removeItem(storageKey)
    localStorage.removeItem(celebrationKey)
  }, [storageKey, celebrationKey])

  return (
    <>
      {/* Confetti Celebration */}
      {showConfetti && <ConfettiAnimation />}

      {/* Progress Bar */}
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium text-navy-200">Your Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{progress}%</span>
            {completedLessons.length > 0 && (
              <button
                onClick={resetProgress}
                className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
                title="Reset progress"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-navy-400">
          <span>{completedLessons.length} of {lessonSlugs.length} lessons completed</span>
          {allComplete && (
            <span className="text-green-400 font-medium flex items-center gap-1">
              ✨ Course Complete!
            </span>
          )}
        </div>
      </div>

      {/* Complete Lesson Button (if viewing a lesson) */}
      {currentLessonSlug && (
        <button
          onClick={() => toggleLessonComplete(currentLessonSlug)}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isCurrentLessonComplete
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
          }`}
        >
          {isCurrentLessonComplete ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed! Click to undo
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Lesson as Complete
            </>
          )}
        </button>
      )}
    </>
  )
}

// Confetti Animation Component
function ConfettiAnimation() {
  const [particles, setParticles] = useState<ReturnType<typeof createConfetti>>([])

  useEffect(() => {
    setParticles(createConfetti())

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.velocityY,
          x: p.x + p.velocityX,
          rotation: p.rotation + p.rotationSpeed,
          velocityY: p.velocityY + 0.1, // gravity
        })).filter(p => p.y < window.innerHeight + 50)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Celebration Message */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
        <div className="bg-navy-900/95 backdrop-blur-sm border border-primary-500/50 rounded-2xl px-8 py-6 shadow-2xl">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-1">Congratulations!</h2>
          <p className="text-primary-400 font-medium">You completed the course!</p>
        </div>
      </div>

      {/* Confetti Particles */}
      <svg className="w-full h-full">
        {particles.map((particle, i) => (
          <rect
            key={i}
            x={particle.x}
            y={particle.y}
            width={10 * particle.scale}
            height={10 * particle.scale}
            fill={particle.color}
            transform={`rotate(${particle.rotation} ${particle.x + 5} ${particle.y + 5})`}
            rx={2}
          />
        ))}
      </svg>
    </div>
  )
}

// Export a hook for accessing progress state externally
export function useLocalProgress(courseSlug: string) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    const storageKey = `learnhub-progress-${courseSlug}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch {
        setCompletedLessons([])
      }
    }
  }, [courseSlug])

  return completedLessons
}