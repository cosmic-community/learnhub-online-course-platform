'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface DailyGoalProps {
  courses: Course[]
}

interface GoalData {
  completedToday: boolean
  lastCompleted: string
  suggestedCourse: string | null
}

const DAILY_TIPS = [
  "💡 Tip: Consistency beats intensity. Even 15 minutes of learning daily compounds into mastery!",
  "💡 Tip: Take notes while learning - it improves retention by up to 34%!",
  "💡 Tip: Teach what you learn to someone else. It's the fastest way to master a concept!",
  "💡 Tip: Review yesterday's lesson before starting today's. Spaced repetition works!",
  "💡 Tip: Code along with the examples. Muscle memory is real for programming!",
  "💡 Tip: Take breaks every 25 minutes. Your brain consolidates learning during rest!",
  "💡 Tip: Set a specific learning time each day. Habits thrive on consistency!",
]

export default function DailyGoal({ courses }: DailyGoalProps) {
  const [goalData, setGoalData] = useState<GoalData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [dailyTip, setDailyTip] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Get a consistent tip for the day based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(DAILY_TIPS[dayOfYear % DAILY_TIPS.length] ?? DAILY_TIPS[0] ?? '')
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-daily-goal')
    
    if (stored) {
      const data = JSON.parse(stored) as GoalData
      if (data.lastCompleted === today) {
        setGoalData(data)
        return
      }
    }
    
    // Pick a random course to suggest
    const randomCourse = courses.length > 0 
      ? courses[Math.floor(Math.random() * courses.length)]
      : null
    
    const newGoalData: GoalData = {
      completedToday: false,
      lastCompleted: '',
      suggestedCourse: randomCourse?.slug ?? null,
    }
    
    setGoalData(newGoalData)
    localStorage.setItem('learnhub-daily-goal', JSON.stringify(newGoalData))
  }, [courses])

  const markComplete = () => {
    if (!goalData) return
    
    const today = new Date().toDateString()
    const updatedData: GoalData = {
      ...goalData,
      completedToday: true,
      lastCompleted: today,
    }
    
    setGoalData(updatedData)
    localStorage.setItem('learnhub-daily-goal', JSON.stringify(updatedData))
  }

  if (!mounted || !goalData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const suggestedCourse = courses.find(c => c.slug === goalData.suggestedCourse)

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-semibold text-white">Today's Goal</h3>
      </div>

      {goalData.completedToday ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-3 animate-bounce-slow">🏆</div>
          <h4 className="text-lg font-semibold text-primary-400 mb-2">Goal Complete!</h4>
          <p className="text-navy-400 text-sm">
            Amazing work! Come back tomorrow to keep your streak alive.
          </p>
        </div>
      ) : (
        <>
          {suggestedCourse ? (
            <div className="space-y-4">
              <div className="p-4 bg-navy-800/50 rounded-lg">
                <p className="text-navy-300 text-sm mb-2">Suggested for you today:</p>
                <Link 
                  href={`/courses/${suggestedCourse.slug}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    {suggestedCourse.metadata?.thumbnail ? (
                      <img
                        src={`${suggestedCourse.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                        alt={suggestedCourse.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded bg-navy-700 flex items-center justify-center">
                        📚
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors line-clamp-1">
                        {suggestedCourse.title}
                      </h4>
                      <p className="text-navy-400 text-xs line-clamp-1">
                        {suggestedCourse.metadata?.tagline || 'Start learning today'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <button
                onClick={markComplete}
                className="w-full btn-primary text-sm py-2"
              >
                ✓ Mark Today's Goal Complete
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Link href="/courses" className="btn-primary">
                Browse Courses to Get Started
              </Link>
            </div>
          )}
        </>
      )}

      {/* Daily Tip */}
      <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
        <p className="text-xs text-primary-300">{dailyTip}</p>
      </div>
    </div>
  )
}