'use client'

import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'
import LearningStreak from './LearningStreak'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
}

export default function LearningStats({ totalCourses, totalLessons }: LearningStatsProps) {
  const [completedLessons, setCompletedLessons] = useState(0)
  const [enrolledCourses, setEnrolledCourses] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const completed = localStorage.getItem('completed-lessons')
    const enrolled = localStorage.getItem('enrolled-courses')
    
    if (completed) {
      setCompletedLessons(JSON.parse(completed).length)
    }
    if (enrolled) {
      setEnrolledCourses(JSON.parse(enrolled).length)
    }
  }, [])

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="card p-8 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-white">Your Learning Journey</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div className="flex justify-center">
          <LearningStreak />
        </div>
        
        {/* Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <ProgressRing 
            progress={progressPercentage} 
            size={140}
            strokeWidth={10}
            label="Overall Progress"
          />
          <p className="text-sm text-navy-400 mt-3 text-center">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/50">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{enrolledCourses}</div>
              <div className="text-xs text-navy-400">Courses Started</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/50">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedLessons}</div>
              <div className="text-xs text-navy-400">Lessons Completed</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/50">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedLessons * 25}</div>
              <div className="text-xs text-navy-400">Minutes Learned</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivational message */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 text-center">
        <p className="text-navy-200 text-sm">
          {progressPercentage === 0 && "🚀 Start your first lesson to begin tracking your progress!"}
          {progressPercentage > 0 && progressPercentage < 25 && "🌱 Great start! Keep the momentum going!"}
          {progressPercentage >= 25 && progressPercentage < 50 && "💪 You're making excellent progress!"}
          {progressPercentage >= 50 && progressPercentage < 75 && "🔥 Halfway there! You're on fire!"}
          {progressPercentage >= 75 && progressPercentage < 100 && "⭐ Almost there! The finish line is in sight!"}
          {progressPercentage >= 100 && "🏆 Congratulations! You've completed all lessons!"}
        </p>
      </div>
    </div>
  )
}