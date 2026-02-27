'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  courseId: string
  courseName: string
  totalLessons: number
  lessonIds: string[]
}

export default function LearningProgress({ 
  courseId, 
  courseName, 
  totalLessons, 
  lessonIds 
}: LearningProgressProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`progress-${courseId}`)
    if (stored) {
      setCompletedLessons(JSON.parse(stored))
    }
  }, [courseId])

  const progress = totalLessons > 0 
    ? Math.round((completedLessons.length / totalLessons) * 100) 
    : 0

  const isCompleted = progress === 100

  useEffect(() => {
    if (isCompleted && completedLessons.length > 0) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted, completedLessons.length])

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-green-500/20 flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-white font-bold text-lg">Course Completed!</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Your Progress</h3>
        <span className={`text-2xl font-bold ${isCompleted ? 'text-green-400' : 'text-primary-400'}`}>
          {progress}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-3 bg-navy-800 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isCompleted 
              ? 'bg-gradient-to-r from-green-500 to-green-400' 
              : 'bg-gradient-to-r from-primary-600 to-primary-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-navy-400">
          {completedLessons.length} of {totalLessons} lessons completed
        </span>
        {isCompleted && (
          <span className="flex items-center gap-1 text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed!
          </span>
        )}
      </div>
      
      {/* Milestone badges */}
      <div className="mt-4 pt-4 border-t border-navy-800">
        <p className="text-xs text-navy-500 mb-2">Milestones</p>
        <div className="flex gap-2">
          <MilestoneBadge achieved={progress >= 25} label="25%" icon="🌱" />
          <MilestoneBadge achieved={progress >= 50} label="50%" icon="🌿" />
          <MilestoneBadge achieved={progress >= 75} label="75%" icon="🌳" />
          <MilestoneBadge achieved={progress >= 100} label="100%" icon="🏆" />
        </div>
      </div>
    </div>
  )
}

function MilestoneBadge({ achieved, label, icon }: { achieved: boolean; label: string; icon: string }) {
  return (
    <div 
      className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 ${
        achieved 
          ? 'bg-primary-500/20 border border-primary-500/40 scale-100' 
          : 'bg-navy-800/50 border border-navy-700 scale-95 opacity-50'
      }`}
    >
      <span className={`text-lg ${achieved ? '' : 'grayscale'}`}>{icon}</span>
      <span className={`text-xs ${achieved ? 'text-primary-300' : 'text-navy-500'}`}>{label}</span>
    </div>
  )
}