'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalHours: number
  totalLessons: number
}

export default function LearningStats({ 
  totalCourses, 
  totalInstructors, 
  totalCategories,
  totalHours,
  totalLessons
}: LearningStatsProps) {
  const [streak, setStreak] = useState(0)
  const [animatedValues, setAnimatedValues] = useState({
    courses: 0,
    instructors: 0,
    hours: 0,
    lessons: 0
  })

  useEffect(() => {
    // Get or initialize streak from localStorage
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0')
    const today = new Date().toDateString()
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else if (diffDays === 0) {
        // Same day - keep streak
        setStreak(currentStreak)
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub-streak', '1')
    }
    
    localStorage.setItem('learnhub-last-visit', today)
  }, [])

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues({
        courses: Math.round(totalCourses * easeOut),
        instructors: Math.round(totalInstructors * easeOut),
        hours: Math.round(totalHours * easeOut),
        lessons: Math.round(totalLessons * easeOut)
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          courses: totalCourses,
          instructors: totalInstructors,
          hours: totalHours,
          lessons: totalLessons
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalInstructors, totalHours, totalLessons])

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
      {/* Streak Counter */}
      <div className="stat-card streak-card col-span-2 md:col-span-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={`text-2xl ${streak > 0 ? 'animate-bounce-slow' : ''}`}>
            {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨'}
          </span>
        </div>
        <div className="text-3xl font-bold text-white">{streak}</div>
        <div className="text-navy-400 text-sm">Day Streak</div>
        {streak >= 7 && (
          <div className="text-xs text-primary-400 mt-1 animate-pulse">You&apos;re on fire!</div>
        )}
      </div>
      
      {/* Courses */}
      <div className="stat-card">
        <div className="text-3xl font-bold text-white">{animatedValues.courses}+</div>
        <div className="text-navy-400 text-sm">Courses</div>
      </div>
      
      {/* Instructors */}
      <div className="stat-card">
        <div className="text-3xl font-bold text-white">{animatedValues.instructors}+</div>
        <div className="text-navy-400 text-sm">Instructors</div>
      </div>
      
      {/* Hours */}
      <div className="stat-card">
        <div className="text-3xl font-bold text-white">{animatedValues.hours}+</div>
        <div className="text-navy-400 text-sm">Hours</div>
      </div>
      
      {/* Lessons */}
      <div className="stat-card">
        <div className="text-3xl font-bold text-white">{animatedValues.lessons}+</div>
        <div className="text-navy-400 text-sm">Lessons</div>
      </div>
    </div>
  )
}