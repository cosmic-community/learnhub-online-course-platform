'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface LessonProgressTrackerProps {
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  lessonSlug: string
  lessonTitle: string
  lessonNumber: number
  totalLessons: number
  nextLessonSlug?: string
}

interface LearningStats {
  streak: number
  xp: number
  level: number
  lessonsCompleted: number
  lastVisit: string
}

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastLesson?: string
  lastLessonSlug?: string
  progress: number
  lastAccessed: string
}

export default function LessonProgressTracker({
  courseSlug,
  courseTitle,
  courseThumbnail,
  lessonSlug,
  lessonTitle,
  lessonNumber,
  totalLessons,
  nextLessonSlug
}: LessonProgressTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showXpPopup, setShowXpPopup] = useState(false)

  useEffect(() => {
    // Track this lesson as visited
    const completedKey = `learnhub-completed-${courseSlug}-${lessonSlug}`
    const alreadyCompleted = localStorage.getItem(completedKey)
    
    if (alreadyCompleted) {
      setIsCompleted(true)
    }

    // Update recent courses
    const recentKey = 'learnhub-recent-courses'
    const saved = localStorage.getItem(recentKey)
    const recent: RecentCourse[] = saved ? JSON.parse(saved) : []

    // Calculate progress
    const completedLessonsKey = `learnhub-course-progress-${courseSlug}`
    const completedLessons: string[] = JSON.parse(localStorage.getItem(completedLessonsKey) || '[]')
    const progress = Math.round((completedLessons.length / totalLessons) * 100)

    // Update or add course to recent
    const existingIndex = recent.findIndex(c => c.slug === courseSlug)
    const courseEntry: RecentCourse = {
      slug: courseSlug,
      title: courseTitle,
      thumbnail: courseThumbnail,
      lastLesson: lessonTitle,
      lastLessonSlug: lessonSlug,
      progress,
      lastAccessed: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      recent[existingIndex] = courseEntry
    } else {
      recent.push(courseEntry)
    }

    localStorage.setItem(recentKey, JSON.stringify(recent))
  }, [courseSlug, courseTitle, courseThumbnail, lessonSlug, lessonTitle, totalLessons])

  const handleComplete = useCallback(() => {
    if (isCompleted) return

    // Mark lesson as completed
    const completedKey = `learnhub-completed-${courseSlug}-${lessonSlug}`
    localStorage.setItem(completedKey, 'true')

    // Update course progress
    const progressKey = `learnhub-course-progress-${courseSlug}`
    const completed: string[] = JSON.parse(localStorage.getItem(progressKey) || '[]')
    if (!completed.includes(lessonSlug)) {
      completed.push(lessonSlug)
      localStorage.setItem(progressKey, JSON.stringify(completed))
    }

    // Award XP
    const baseXP = 25
    const bonusXP = lessonNumber === totalLessons ? 50 : 0 // Bonus for completing course
    const totalXP = baseXP + bonusXP
    setXpEarned(totalXP)

    // Update learning stats
    const statsKey = 'learnhub-stats'
    const stats: LearningStats = JSON.parse(localStorage.getItem(statsKey) || '{}')
    const newStats: LearningStats = {
      ...stats,
      xp: (stats.xp || 0) + totalXP,
      lessonsCompleted: (stats.lessonsCompleted || 0) + 1,
      level: stats.level || 1
    }
    
    // Recalculate level
    const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000]
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (newStats.xp >= LEVEL_THRESHOLDS[i]) {
        newStats.level = i + 1
        break
      }
    }

    localStorage.setItem(statsKey, JSON.stringify(newStats))

    // Update recent courses progress
    const recentKey = 'learnhub-recent-courses'
    const recent: RecentCourse[] = JSON.parse(localStorage.getItem(recentKey) || '[]')
    const courseIndex = recent.findIndex(c => c.slug === courseSlug)
    if (courseIndex >= 0) {
      recent[courseIndex].progress = Math.round((completed.length / totalLessons) * 100)
      localStorage.setItem(recentKey, JSON.stringify(recent))
    }

    setIsCompleted(true)
    setShowXpPopup(true)
    
    // Show confetti for course completion
    if (lessonNumber === totalLessons) {
      setShowConfetti(true)
    }

    // Hide XP popup after animation
    setTimeout(() => setShowXpPopup(false), 2000)
  }, [isCompleted, courseSlug, lessonSlug, lessonNumber, totalLessons])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  return (
    <div className="card p-6 mb-8 relative overflow-hidden">
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      {/* XP Popup */}
      {showXpPopup && (
        <div className="absolute top-4 right-4 animate-bounce">
          <div className="bg-primary-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            +{xpEarned} XP! 🎉
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {isCompleted ? '✅ Lesson Completed!' : 'Mark as Complete'}
          </h3>
          <p className="text-navy-400 text-sm">
            {isCompleted 
              ? `Great work! You earned ${xpEarned || 25} XP for this lesson.`
              : 'Complete this lesson to earn XP and track your progress.'
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="btn-primary"
            >
              Complete Lesson
            </button>
          )}
          {nextLessonSlug && (
            <Link
              href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
              className={isCompleted ? 'btn-primary' : 'btn-secondary'}
            >
              Next Lesson →
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-navy-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy-400">Course Progress</span>
          <span className="text-primary-400">{lessonNumber} / {totalLessons} lessons</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
            style={{ width: `${(lessonNumber / totalLessons) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}