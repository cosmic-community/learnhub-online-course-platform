'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  courseSlug: string
  lessonSlug: string
  totalLessons: number
  lessonIndex: number
}

// Confetti particle type
interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  velocityX: number
  velocityY: number
}

export default function LearningProgress({ 
  courseSlug, 
  lessonSlug,
  totalLessons,
  lessonIndex 
}: LearningProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        setCompletedLessons(parsed)
        setIsCompleted(parsed.includes(lessonSlug))
      }
    }
  }, [storageKey, lessonSlug])

  // Generate confetti particles
  const generateConfetti = useCallback(() => {
    const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171']
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
      })
    }
    
    setParticles(newParticles)
  }, [])

  // Animate confetti
  useEffect(() => {
    if (!showConfetti || !isAnimating) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.velocityX,
          y: p.y + p.velocityY,
          rotation: p.rotation + 5,
          velocityY: p.velocityY + 0.1, // gravity
        })).filter(p => p.y < 120) // remove particles that fall out of view
      )
    }, 16)

    const timeout = setTimeout(() => {
      setShowConfetti(false)
      setIsAnimating(false)
      setParticles([])
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [showConfetti, isAnimating])

  const toggleCompletion = () => {
    const newCompleted = !isCompleted
    setIsCompleted(newCompleted)

    let updatedLessons: string[]
    if (newCompleted) {
      updatedLessons = [...completedLessons, lessonSlug]
      // Trigger confetti celebration!
      setShowConfetti(true)
      setIsAnimating(true)
      generateConfetti()
    } else {
      updatedLessons = completedLessons.filter(l => l !== lessonSlug)
    }

    setCompletedLessons(updatedLessons)
    localStorage.setItem(storageKey, JSON.stringify(updatedLessons))
  }

  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100)
  const allCompleted = completedLessons.length === totalLessons

  return (
    <div className="relative">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
                transition: 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* Progress card */}
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Your Progress
          </h3>
          <span className="text-sm text-navy-400">
            {completedLessons.length} / {totalLessons} lessons
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-navy-800 rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Animated shine effect */}
          <div 
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"
            style={{ 
              width: `${progressPercentage}%`,
              animationDuration: '2s',
              animationIterationCount: 'infinite',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allCompleted ? (
              <span className="flex items-center gap-2 text-green-400 font-medium">
                <span className="text-xl">🏆</span>
                Course Completed!
              </span>
            ) : (
              <span className="text-navy-400 text-sm">
                {progressPercentage}% complete
              </span>
            )}
          </div>

          {/* Mark complete button */}
          <button
            onClick={toggleCompletion}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${isCompleted 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
              }
            `}
          >
            {isCompleted ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Complete
              </>
            )}
          </button>
        </div>

        {/* Lesson indicator dots */}
        <div className="flex gap-1.5 mt-4 flex-wrap">
          {Array.from({ length: totalLessons }).map((_, i) => {
            const isCurrentLesson = i === lessonIndex
            const isLessonCompleted = completedLessons.length > i || 
              (i < lessonIndex && completedLessons.includes(lessonSlug))
            
            return (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isCurrentLesson 
                    ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' 
                    : ''
                  }
                  ${isLessonCompleted || (isCurrentLesson && isCompleted)
                    ? 'bg-green-500' 
                    : 'bg-navy-700'
                  }
                `}
                title={`Lesson ${i + 1}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}