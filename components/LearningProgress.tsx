'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  courseSlug: string
  totalLessons: number
  lessonSlugs: string[]
}

interface ProgressData {
  completedLessons: string[]
  lastActivityDate: string
  streak: number
}

export default function LearningProgress({ 
  courseSlug, 
  totalLessons, 
  lessonSlugs 
}: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  
  useEffect(() => {
    // Load progress from localStorage
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ProgressData
        setProgress(parsed)
        
        // Check if course just completed
        if (parsed.completedLessons.length === totalLessons && totalLessons > 0) {
          const celebrated = localStorage.getItem(`course-celebrated-${courseSlug}`)
          if (!celebrated) {
            setShowCelebration(true)
            localStorage.setItem(`course-celebrated-${courseSlug}`, 'true')
          }
        }
      } catch {
        setProgress({ completedLessons: [], lastActivityDate: '', streak: 0 })
      }
    } else {
      setProgress({ completedLessons: [], lastActivityDate: '', streak: 0 })
    }
  }, [courseSlug, totalLessons])

  const completedCount = progress?.completedLessons.length ?? 0
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCompleted = completedCount === totalLessons && totalLessons > 0

  if (!progress) return null

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay onClose={() => setShowCelebration(false)} />
      )}
      
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            📊 Your Progress
            {isCompleted && <span className="text-2xl">🏆</span>}
          </h3>
          {progress.streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
              🔥 {progress.streak} day streak
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="h-4 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                  : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {progressPercent}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-navy-400">
            {completedCount} of {totalLessons} lessons completed
          </span>
          {isCompleted ? (
            <span className="text-green-400 font-medium">Course Complete! 🎉</span>
          ) : (
            <span className="text-navy-400">
              {totalLessons - completedCount} lessons remaining
            </span>
          )}
        </div>
        
        {/* Lesson Checklist Preview */}
        {totalLessons > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-700">
            <div className="flex flex-wrap gap-2">
              {lessonSlugs.slice(0, 8).map((slug, index) => {
                const isLessonCompleted = progress.completedLessons.includes(slug)
                return (
                  <div
                    key={slug}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isLessonCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}
                    title={`Lesson ${index + 1}`}
                  >
                    {isLessonCompleted ? '✓' : index + 1}
                  </div>
                )
              })}
              {lessonSlugs.length > 8 && (
                <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-xs text-navy-400">
                  +{lessonSlugs.length - 8}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Lesson completion button component
interface LessonCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
  onComplete?: () => void
}

export function LessonCompleteButton({ 
  courseSlug, 
  lessonSlug,
  onComplete 
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  
  useEffect(() => {
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ProgressData
        setIsCompleted(parsed.completedLessons.includes(lessonSlug))
      } catch {
        // Ignore parse errors
      }
    }
  }, [courseSlug, lessonSlug])
  
  const handleComplete = useCallback(() => {
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    let progress: ProgressData = { completedLessons: [], lastActivityDate: '', streak: 0 }
    
    if (stored) {
      try {
        progress = JSON.parse(stored)
      } catch {
        // Use default
      }
    }
    
    // Toggle completion
    if (progress.completedLessons.includes(lessonSlug)) {
      progress.completedLessons = progress.completedLessons.filter(s => s !== lessonSlug)
      setIsCompleted(false)
    } else {
      progress.completedLessons.push(lessonSlug)
      setIsCompleted(true)
      setJustCompleted(true)
      setTimeout(() => setJustCompleted(false), 2000)
      
      // Update streak
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (progress.lastActivityDate === today) {
        // Already active today, streak unchanged
      } else if (progress.lastActivityDate === yesterday) {
        // Continuing streak
        progress.streak += 1
      } else if (progress.lastActivityDate !== today) {
        // Starting new streak or first activity
        progress.streak = 1
      }
      progress.lastActivityDate = today
    }
    
    localStorage.setItem(`course-progress-${courseSlug}`, JSON.stringify(progress))
    onComplete?.()
  }, [courseSlug, lessonSlug, onComplete])
  
  return (
    <button
      onClick={handleComplete}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
        isCompleted
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-primary-500 text-white hover:bg-primary-600'
      } ${justCompleted ? 'scale-110' : 'scale-100'}`}
    >
      {isCompleted ? (
        <>
          <span className="text-xl">✓</span>
          Completed!
        </>
      ) : (
        <>
          <span className="text-xl">○</span>
          Mark as Complete
        </>
      )}
    </button>
  )
}

// Celebration overlay with confetti effect
function CelebrationOverlay({ onClose }: { onClose: () => void }) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  
  useEffect(() => {
    // Generate confetti pieces
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setConfetti(pieces)
    
    // Auto-close after animation
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 animate-confetti"
            style={{
              left: `${piece.left}%`,
              top: '-20px',
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Celebration Message */}
      <div className="relative text-center animate-bounce-in">
        <div className="text-8xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Congratulations!
        </h2>
        <p className="text-xl text-navy-300 mb-6">
          You&apos;ve completed this course! 🏆
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  )
}

// Global learning stats component for homepage
export function LearningStats() {
  const [stats, setStats] = useState<{
    totalCompleted: number
    currentStreak: number
    totalCourses: number
  } | null>(null)
  
  useEffect(() => {
    // Aggregate stats from all course progress
    let totalCompleted = 0
    let maxStreak = 0
    let totalCourses = 0
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('course-progress-')) {
        totalCourses++
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}') as ProgressData
          totalCompleted += data.completedLessons?.length || 0
          if (data.streak > maxStreak) maxStreak = data.streak
        } catch {
          // Ignore
        }
      }
    }
    
    setStats({
      totalCompleted,
      currentStreak: maxStreak,
      totalCourses
    })
  }, [])
  
  if (!stats || stats.totalCourses === 0) return null
  
  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        🎯 Your Learning Journey
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary-400">{stats.totalCompleted}</div>
          <div className="text-xs text-navy-400">Lessons Done</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-400">
            {stats.currentStreak > 0 ? `${stats.currentStreak}🔥` : '0'}
          </div>
          <div className="text-xs text-navy-400">Day Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{stats.totalCourses}</div>
          <div className="text-xs text-navy-400">In Progress</div>
        </div>
      </div>
    </div>
  )
}