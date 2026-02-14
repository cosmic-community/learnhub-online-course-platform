'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyGoalData {
  lessonsCompleted: number
  minutesLearned: number
  lastUpdated: string
}

const DAILY_GOAL_KEY = 'learnhub-daily-goal'

const learningTips = [
  "Try the Pomodoro technique: 25 min study, 5 min break! 🍅",
  "Teaching others helps you learn 2x faster! 👨‍🏫",
  "Review yesterday's lesson for better retention! 🧠",
  "Take handwritten notes - it boosts memory! 📝",
  "Stay hydrated while learning! 💧",
  "Mix different topics to improve understanding! 🎨",
  "Practice coding exercises, don't just watch! 💻",
  "Set a specific time for daily learning! ⏰",
]

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

export default function DailyGoal() {
  const [goalData, setGoalData] = useState<DailyGoalData>({
    lessonsCompleted: 0,
    minutesLearned: 0,
    lastUpdated: '',
  })
  const [randomTip, setRandomTip] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get a consistent random tip for the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setRandomTip(learningTips[dayOfYear % learningTips.length] ?? learningTips[0] ?? '')

    // Load daily goal data
    const stored = localStorage.getItem(DAILY_GOAL_KEY)
    if (stored) {
      const data: DailyGoalData = JSON.parse(stored)
      if (data.lastUpdated === getTodayKey()) {
        setGoalData(data)
      } else {
        // Reset for new day
        const newData: DailyGoalData = {
          lessonsCompleted: 0,
          minutesLearned: 0,
          lastUpdated: getTodayKey(),
        }
        localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(newData))
        setGoalData(newData)
      }
    }
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-40 mb-4"></div>
          <div className="h-4 bg-navy-700 rounded w-full"></div>
        </div>
      </div>
    )
  }

  const dailyGoalLessons = 2
  const dailyGoalMinutes = 30
  const lessonProgress = Math.min((goalData.lessonsCompleted / dailyGoalLessons) * 100, 100)
  const timeProgress = Math.min((goalData.minutesLearned / dailyGoalMinutes) * 100, 100)
  const overallProgress = (lessonProgress + timeProgress) / 2
  const goalCompleted = overallProgress >= 100

  return (
    <div className={`card p-6 bg-gradient-to-br ${goalCompleted ? 'from-green-500/20 to-emerald-500/10 border-green-500/30' : 'from-primary-500/10 to-navy-900'} transition-all duration-500`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {goalCompleted ? '✅' : '🎯'} Today's Goal
        </h3>
        {goalCompleted && (
          <span className="text-sm text-green-400 font-medium animate-pulse">
            Completed! 🎉
          </span>
        )}
      </div>

      {/* Progress Circles */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-navy-700"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - lessonProgress / 100)}`}
                className="text-primary-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{goalData.lessonsCompleted}</span>
            </div>
          </div>
          <div className="text-sm text-navy-400">Lessons</div>
          <div className="text-xs text-navy-500">Goal: {dailyGoalLessons}</div>
        </div>

        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-navy-700"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - timeProgress / 100)}`}
                className="text-yellow-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{goalData.minutesLearned}</span>
            </div>
          </div>
          <div className="text-sm text-navy-400">Minutes</div>
          <div className="text-xs text-navy-500">Goal: {dailyGoalMinutes}</div>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="bg-navy-800/50 rounded-lg p-3 mb-4">
        <div className="text-xs text-navy-400 mb-1">💡 Tip of the Day</div>
        <p className="text-sm text-navy-200">{randomTip}</p>
      </div>

      {/* CTA */}
      {!goalCompleted && (
        <Link 
          href="/courses"
          className="btn-primary w-full text-center text-sm"
        >
          Continue Learning →
        </Link>
      )}
    </div>
  )
}