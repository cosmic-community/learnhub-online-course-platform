'use client'

import { useState, useEffect } from 'react'

interface DailyGoalProps {
  totalLessons: number
}

export default function DailyGoal({ totalLessons }: DailyGoalProps) {
  const [completedToday, setCompletedToday] = useState(0)
  const [dailyGoal] = useState(3) // Default goal: 3 lessons per day

  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('learnhub-goal-date')
    const storedCompleted = localStorage.getItem('learnhub-goal-completed')

    if (storedDate === today && storedCompleted) {
      setCompletedToday(parseInt(storedCompleted))
    } else {
      // New day - reset progress
      localStorage.setItem('learnhub-goal-date', today)
      localStorage.setItem('learnhub-goal-completed', '0')
      setCompletedToday(0)
    }
  }, [])

  const progress = Math.min((completedToday / dailyGoal) * 100, 100)
  const isGoalMet = completedToday >= dailyGoal

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Goal</h3>
        <span className={`text-sm font-medium ${isGoalMet ? 'text-green-400' : 'text-navy-400'}`}>
          {completedToday}/{dailyGoal} lessons
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-navy-800 rounded-full overflow-hidden mb-4">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            isGoalMet
              ? 'bg-gradient-to-r from-green-500 to-emerald-400'
              : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${progress}%` }}
        />
        {/* Animated shimmer */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {/* Goal status */}
      {isGoalMet ? (
        <div className="flex items-center gap-2 text-green-400">
          <span className="text-2xl">🎉</span>
          <span className="font-medium">Daily goal achieved!</span>
        </div>
      ) : (
        <p className="text-sm text-navy-400">
          Complete {dailyGoal - completedToday} more {dailyGoal - completedToday === 1 ? 'lesson' : 'lessons'} to reach your daily goal
        </p>
      )}

      {/* Quick stats */}
      <div className="mt-4 pt-4 border-t border-navy-800 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalLessons}</div>
          <div className="text-xs text-navy-500">Total Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-400">{Math.round((completedToday / Math.max(totalLessons, 1)) * 100)}%</div>
          <div className="text-xs text-navy-500">Today's Progress</div>
        </div>
      </div>
    </div>
  )
}