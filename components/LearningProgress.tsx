'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningProgressProps {
  courses: Course[]
}

interface ProgressData {
  completedLessons: string[]
  startedCourses: string[]
  totalTimeSpent: number // in minutes
  streakDays: number
  lastVisit: string
}

export default function LearningProgress({ courses }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('learnhub-progress')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress) as ProgressData
      setProgress(parsed)
      
      // Update streak
      const today = new Date().toDateString()
      const lastVisit = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.streakDays
      if (lastVisit !== today) {
        if (lastVisit === yesterday) {
          newStreak = parsed.streakDays + 1
        } else if (lastVisit !== today) {
          newStreak = 1
        }
        
        const updated = {
          ...parsed,
          streakDays: newStreak,
          lastVisit: new Date().toISOString()
        }
        localStorage.setItem('learnhub-progress', JSON.stringify(updated))
        setProgress(updated)
      }
    } else {
      // Initialize progress for new users
      const initial: ProgressData = {
        completedLessons: [],
        startedCourses: [],
        totalTimeSpent: 0,
        streakDays: 1,
        lastVisit: new Date().toISOString()
      }
      localStorage.setItem('learnhub-progress', JSON.stringify(initial))
      setProgress(initial)
    }
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!progress) return null

  const completedCount = progress.completedLessons.length
  const startedCount = progress.startedCourses.length
  const hoursSpent = Math.round(progress.totalTimeSpent / 60)
  
  // Get recommended courses (courses user hasn't started)
  const recommendedCourses = courses
    .filter(course => !progress.startedCourses.includes(course.slug))
    .slice(0, 2)

  // Calculate weekly goal progress (mock goal: 5 lessons per week)
  const weeklyGoal = 5
  const thisWeekLessons = Math.min(completedCount, weeklyGoal)
  const weeklyProgress = (thisWeekLessons / weeklyGoal) * 100

  return (
    <section className={`py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 lg:p-8 bg-gradient-to-br from-navy-900/80 to-navy-900/50 border-primary-500/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome & Streak */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl shadow-lg shadow-primary-500/25">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Learning Journey</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl">🔥</span>
                  <span className="text-primary-400 font-semibold">{progress.streakDays} day streak!</span>
                  {progress.streakDays >= 7 && <span className="text-yellow-400">⭐</span>}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center p-3 rounded-xl bg-navy-800/50">
                <div className="text-2xl font-bold text-white">{completedCount}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-navy-800/50">
                <div className="text-2xl font-bold text-white">{startedCount}</div>
                <div className="text-xs text-navy-400">Courses Started</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-navy-800/50">
                <div className="text-2xl font-bold text-white">{hoursSpent}h</div>
                <div className="text-xs text-navy-400">Time Invested</div>
              </div>
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="mt-6 pt-6 border-t border-navy-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-navy-300">Weekly Goal Progress</span>
              <span className="text-sm font-medium text-primary-400">{thisWeekLessons}/{weeklyGoal} lessons</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            {weeklyProgress >= 100 && (
              <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                <span>🎉</span> Amazing! You&apos;ve hit your weekly goal!
              </p>
            )}
          </div>

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <div className="mt-6 pt-6 border-t border-navy-700/50">
              <h3 className="text-sm font-medium text-navy-300 mb-3">Recommended for you</h3>
              <div className="flex flex-wrap gap-3">
                {recommendedCourses.map(course => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 transition-colors group"
                  >
                    {course.metadata?.thumbnail?.imgix_url && (
                      <img 
                        src={`${course.metadata.thumbnail.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover"
                      />
                    )}
                    <span className="text-sm text-white group-hover:text-primary-400 transition-colors">
                      {course.metadata?.title || course.title}
                    </span>
                    <svg className="w-4 h-4 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}