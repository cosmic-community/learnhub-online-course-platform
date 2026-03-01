'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyGoalData {
  date: string
  lessonsTarget: number
  lessonsCompleted: number
  minutesLearned: number
  lastCourseSlug: string | null
  lastCourseName: string | null
}

const ENCOURAGING_TIPS = [
  "💡 Tip: Start with just 15 minutes - small wins build big habits!",
  "🧠 Fun fact: Consistent learners retain 40% more information!",
  "⏰ Best time to learn? Right now! Your brain is ready.",
  "🎯 Focus on progress, not perfection. Every lesson counts!",
  "📚 Reading code is just as valuable as writing it!",
  "💪 You've got this! One lesson at a time.",
]

export default function DailyGoal() {
  const [goalData, setGoalData] = useState<DailyGoalData | null>(null)
  const [tip, setTip] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-daily-goal')
    
    if (stored) {
      const data: DailyGoalData = JSON.parse(stored)
      if (data.date === today) {
        setGoalData(data)
      } else {
        // New day, reset goals but keep course info
        const newData: DailyGoalData = {
          date: today,
          lessonsTarget: 2,
          lessonsCompleted: 0,
          minutesLearned: 0,
          lastCourseSlug: data.lastCourseSlug,
          lastCourseName: data.lastCourseName,
        }
        localStorage.setItem('learnhub-daily-goal', JSON.stringify(newData))
        setGoalData(newData)
      }
    } else {
      const newData: DailyGoalData = {
        date: today,
        lessonsTarget: 2,
        lessonsCompleted: 0,
        minutesLearned: 0,
        lastCourseSlug: null,
        lastCourseName: null,
      }
      localStorage.setItem('learnhub-daily-goal', JSON.stringify(newData))
      setGoalData(newData)
    }

    setTip(ENCOURAGING_TIPS[Math.floor(Math.random() * ENCOURAGING_TIPS.length)])
  }, [])

  if (!goalData || !isVisible) return null

  const progressPercent = Math.min((goalData.lessonsCompleted / goalData.lessonsTarget) * 100, 100)
  const isGoalComplete = goalData.lessonsCompleted >= goalData.lessonsTarget

  return (
    <div className="bg-gradient-to-r from-primary-500/10 to-navy-900/50 border border-primary-500/20 rounded-2xl p-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {isGoalComplete ? '🎉 Daily Goal Complete!' : "📅 Today's Learning Goal"}
            </h3>
            <p className="text-navy-400 text-sm mt-1">{tip}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-navy-300">
              {goalData.lessonsCompleted} of {goalData.lessonsTarget} lessons
            </span>
            <span className={`font-medium ${isGoalComplete ? 'text-green-400' : 'text-primary-400'}`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isGoalComplete 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-primary-400 to-primary-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action area */}
        <div className="flex items-center justify-between">
          {goalData.lastCourseSlug ? (
            <Link 
              href={`/courses/${goalData.lastCourseSlug}`}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue: {goalData.lastCourseName}
            </Link>
          ) : (
            <span className="text-sm text-navy-500">No recent course</span>
          )}
          
          <Link 
            href="/courses"
            className="btn-primary text-sm py-2 px-4"
          >
            {isGoalComplete ? 'Explore More' : 'Start Learning'}
          </Link>
        </div>
      </div>
    </div>
  )
}