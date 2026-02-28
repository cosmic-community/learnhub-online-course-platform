'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
  lessonTitle: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLearningDate: string | null
  totalLessonsCompleted: number
  completedLessons: string[]
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastLearningDate: null,
  totalLessonsCompleted: 0,
  completedLessons: [],
}

export default function LessonCompleteButton({ lessonSlug, courseSlug, lessonTitle }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [streakInfo, setStreakInfo] = useState<{ newStreak: number; isMilestone: boolean } | null>(null)

  const lessonKey = `${courseSlug}/${lessonSlug}`

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StreakData
        setIsCompleted(parsed.completedLessons.includes(lessonKey))
      } catch {
        // Ignore parse errors
      }
    }
  }, [lessonKey])

  const handleComplete = () => {
    if (isCompleted) return

    const stored = localStorage.getItem('learnhub-streak')
    let streakData: StreakData = defaultStreakData

    if (stored) {
      try {
        streakData = JSON.parse(stored) as StreakData
      } catch {
        // Use default
      }
    }

    const today = new Date().toDateString()
    const lastDate = streakData.lastLearningDate
    let newStreak = streakData.currentStreak

    // Calculate new streak
    if (!lastDate || new Date(lastDate).toDateString() !== today) {
      if (lastDate) {
        const lastLearningDate = new Date(lastDate)
        const daysSinceLastLearning = Math.floor(
          (new Date().getTime() - lastLearningDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceLastLearning <= 1) {
          newStreak = streakData.currentStreak + 1
        } else {
          newStreak = 1
        }
      } else {
        newStreak = 1
      }
    }

    const isMilestone = [3, 7, 14, 30, 50, 100].includes(newStreak)

    const updatedData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streakData.longestStreak),
      lastLearningDate: today,
      totalLessonsCompleted: streakData.totalLessonsCompleted + 1,
      completedLessons: [...streakData.completedLessons, lessonKey],
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))

    setIsCompleted(true)
    setShowConfetti(true)
    setShowMessage(true)
    setStreakInfo({ newStreak, isMilestone })

    // Hide message after a few seconds
    setTimeout(() => setShowMessage(false), 5000)
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
  }

  const getMilestoneMessage = (streak: number): string => {
    if (streak === 3) return "🔥 3-day streak! You're building a habit!"
    if (streak === 7) return "⚡ 1 week streak! Amazing consistency!"
    if (streak === 14) return "🌟 2 weeks! You're unstoppable!"
    if (streak === 30) return "💎 1 month streak! Incredible dedication!"
    if (streak === 50) return "🏆 50 days! You're a legend!"
    if (streak === 100) return "👑 100 days! Absolute champion!"
    return ""
  }

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="space-y-4">
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-lg
            transition-all duration-300 transform
            ${isCompleted 
              ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-default' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] shadow-lg shadow-primary-500/25'
            }
          `}
        >
          {isCompleted ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lesson Completed!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark as Complete
            </span>
          )}
        </button>

        {/* Success message */}
        {showMessage && streakInfo && (
          <div className="animate-fade-in-up bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-green-400 font-semibold mb-1">
              🎉 Great job completing &ldquo;{lessonTitle}&rdquo;!
            </div>
            <div className="text-navy-300 text-sm">
              {streakInfo.isMilestone ? (
                <span className="text-yellow-400 font-semibold">
                  {getMilestoneMessage(streakInfo.newStreak)}
                </span>
              ) : (
                <>Your learning streak: {streakInfo.newStreak} day{streakInfo.newStreak !== 1 ? 's' : ''} 🔥</>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}