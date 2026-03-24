'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  totalLessons: number
  courseSlug: string
  courseName: string
}

export default function LearningProgress({ totalLessons, courseSlug, courseName }: LearningProgressProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)

  // Load progress from localStorage
  useEffect(() => {
    const storageKey = `learnhub-progress-${courseSlug}`
    const streakKey = 'learnhub-streak'
    const lastVisitKey = 'learnhub-last-visit'
    
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
    }
    
    const savedStreak = localStorage.getItem(streakKey)
    const savedLastVisit = localStorage.getItem(lastVisitKey)
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10))
    }
    
    if (savedLastVisit) {
      setLastVisit(savedLastVisit)
      
      // Check if streak should continue or reset
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (savedLastVisit !== today && savedLastVisit !== yesterday) {
        // Streak broken - reset
        setStreak(0)
        localStorage.setItem(streakKey, '0')
      } else if (savedLastVisit !== today) {
        // New day, increment streak
        const newStreak = parseInt(savedStreak || '0', 10) + 1
        setStreak(newStreak)
        localStorage.setItem(streakKey, String(newStreak))
        localStorage.setItem(lastVisitKey, today)
      }
    } else {
      // First visit
      const today = new Date().toDateString()
      setStreak(1)
      localStorage.setItem(streakKey, '1')
      localStorage.setItem(lastVisitKey, today)
    }
  }, [courseSlug])

  const markLessonComplete = useCallback((lessonSlug: string) => {
    const storageKey = `learnhub-progress-${courseSlug}`
    
    setCompletedLessons(prev => {
      if (prev.includes(lessonSlug)) return prev
      
      const updated = [...prev, lessonSlug]
      localStorage.setItem(storageKey, JSON.stringify(updated))
      
      // Trigger confetti for milestone completions
      if (updated.length === totalLessons) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      } else if (updated.length % 3 === 0) {
        // Mini celebration every 3 lessons
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      return updated
    })
  }, [courseSlug, totalLessons])

  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0
  const isComplete = completedLessons.length === totalLessons && totalLessons > 0

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}
      
      {/* Progress Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-primary-400 font-bold">{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-4 bg-navy-800 rounded-full overflow-hidden mb-3">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Animated shimmer effect */}
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-navy-400">
            {completedLessons.length} of {totalLessons} lessons completed
          </span>
          <span className={`font-semibold ${isComplete ? 'text-green-400' : 'text-primary-400'}`}>
            {isComplete ? '🎉 Complete!' : `${progress}%`}
          </span>
        </div>
        
        {/* Achievement Badges */}
        {completedLessons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center gap-2 flex-wrap">
              {completedLessons.length >= 1 && (
                <Badge icon="🚀" label="First Step" achieved />
              )}
              {completedLessons.length >= 3 && (
                <Badge icon="⭐" label="Getting Started" achieved />
              )}
              {completedLessons.length >= 5 && (
                <Badge icon="💪" label="Dedicated" achieved />
              )}
              {isComplete && (
                <Badge icon="🏆" label="Course Master" achieved special />
              )}
              {streak >= 3 && (
                <Badge icon="🔥" label={`${streak} Day Streak`} achieved />
              )}
              {streak >= 7 && (
                <Badge icon="💎" label="Week Warrior" achieved special />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Badge Component
function Badge({ 
  icon, 
  label, 
  achieved, 
  special = false 
}: { 
  icon: string
  label: string
  achieved: boolean
  special?: boolean 
}) {
  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-300
        ${achieved 
          ? special 
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30' 
            : 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
          : 'bg-navy-800 text-navy-500 border border-navy-700 opacity-50'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

// Confetti Component
function Confetti() {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  )
}

// Export a hook for marking lessons complete from other components
export function useProgressTracker(courseSlug: string) {
  const markComplete = useCallback((lessonSlug: string) => {
    const storageKey = `learnhub-progress-${courseSlug}`
    const saved = localStorage.getItem(storageKey)
    const current = saved ? JSON.parse(saved) : []
    
    if (!current.includes(lessonSlug)) {
      const updated = [...current, lessonSlug]
      localStorage.setItem(storageKey, JSON.stringify(updated))
      
      // Dispatch custom event for other components to react
      window.dispatchEvent(new CustomEvent('lesson-completed', { 
        detail: { courseSlug, lessonSlug } 
      }))
    }
  }, [courseSlug])

  const isComplete = useCallback((lessonSlug: string) => {
    const storageKey = `learnhub-progress-${courseSlug}`
    const saved = localStorage.getItem(storageKey)
    const current = saved ? JSON.parse(saved) : []
    return current.includes(lessonSlug)
  }, [courseSlug])

  return { markComplete, isComplete }
}