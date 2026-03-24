'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'
import { useStreak } from './LearningStreak'
import { useDailyGoal } from './DailyGoal'
import { useAchievements, AchievementToast } from './AchievementBadge'

interface LessonCompleteProps {
  courseSlug: string
  lessonSlug: string
  nextLessonSlug?: string
}

const COMPLETED_KEY = 'learnhub_completed_lessons'

function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(COMPLETED_KEY)
  return stored ? JSON.parse(stored) : []
}

export default function LessonComplete({ courseSlug, lessonSlug, nextLessonSlug }: LessonCompleteProps) {
  const [isCompleted, setIsCompleted] = useState(() => {
    const completed = getCompletedLessons()
    return completed.includes(`${courseSlug}/${lessonSlug}`)
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  
  const { recordLearning, streakData } = useStreak()
  const { incrementProgress, goalData } = useDailyGoal()
  const { checkAndUnlock, newUnlock, setNewUnlock } = useAchievements()
  
  const handleComplete = useCallback(() => {
    if (isCompleted) return
    
    const lessonKey = `${courseSlug}/${lessonSlug}`
    const completed = getCompletedLessons()
    
    if (!completed.includes(lessonKey)) {
      completed.push(lessonKey)
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed))
    }
    
    setIsCompleted(true)
    setJustCompleted(true)
    setShowConfetti(true)
    
    // Record for streak
    const isNewDay = recordLearning()
    
    // Check for goal completion
    const goalMet = incrementProgress()
    
    // Check for achievements
    const totalLessons = completed.length
    
    if (totalLessons === 1) {
      checkAndUnlock('first_lesson')
    }
    if (totalLessons >= 5) {
      checkAndUnlock('lessons_5')
    }
    if (totalLessons >= 10) {
      checkAndUnlock('lessons_10')
    }
    if (totalLessons >= 25) {
      checkAndUnlock('lessons_25')
    }
    
    // Check streak achievements
    const currentStreak = streakData.currentStreak + (isNewDay ? 1 : 0)
    if (currentStreak >= 3) {
      checkAndUnlock('streak_3')
    }
    if (currentStreak >= 7) {
      checkAndUnlock('streak_7')
    }
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour < 8) {
      checkAndUnlock('early_bird')
    }
    if (hour >= 22) {
      checkAndUnlock('night_owl')
    }
  }, [courseSlug, lessonSlug, isCompleted, recordLearning, incrementProgress, checkAndUnlock, streakData.currentStreak])
  
  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])
  
  return (
    <>
      <Confetti active={showConfetti} onComplete={handleConfettiComplete} />
      
      {newUnlock && (
        <AchievementToast 
          achievement={newUnlock} 
          onClose={() => setNewUnlock(null)} 
        />
      )}
      
      <div className={`card p-8 text-center transition-all duration-500 ${
        justCompleted 
          ? 'bg-gradient-to-r from-green-900/30 to-primary-900/30 border-green-500/30' 
          : ''
      }`}>
        {isCompleted ? (
          <div className="space-y-4">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white">
              {justCompleted ? 'Awesome! Lesson Complete!' : 'Lesson Completed'}
            </h2>
            <p className="text-navy-300">
              {justCompleted 
                ? "Great work! You're making excellent progress on your learning journey."
                : "You've already completed this lesson."}
            </p>
            
            {justCompleted && (
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-navy-800/50 rounded-lg px-4 py-2">
                  <span className="text-orange-400">🔥 {streakData.currentStreak}</span>
                  <span className="text-navy-400 text-sm ml-2">day streak</span>
                </div>
                <div className="bg-navy-800/50 rounded-lg px-4 py-2">
                  <span className="text-primary-400">🎯 {goalData.todayProgress}/{goalData.dailyGoal}</span>
                  <span className="text-navy-400 text-sm ml-2">daily goal</span>
                </div>
              </div>
            )}
            
            {nextLessonSlug && (
              <Link
                href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                className="btn-primary mt-6 inline-flex"
              >
                Continue to Next Lesson →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white">Ready to Mark Complete?</h2>
            <p className="text-navy-300">
              Click the button below when you've finished this lesson.
            </p>
            <button
              onClick={handleComplete}
              className="btn-primary mt-4 group"
            >
              <span className="mr-2">✓</span>
              Mark as Complete
              <span className="ml-2 group-hover:animate-bounce inline-block">🎊</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}