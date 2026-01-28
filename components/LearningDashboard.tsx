'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningDashboardProps {
  courses: Course[]
}

interface CourseProgress {
  slug: string
  completed: number
  total: number
}

export default function LearningDashboard({ courses }: LearningDashboardProps) {
  const [progressData, setProgressData] = useState<CourseProgress[]>([])
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    // Load all course progress from localStorage
    const data: CourseProgress[] = courses.map(course => {
      const stored = localStorage.getItem(`course-progress-${course.slug}`)
      const completed = stored ? (JSON.parse(stored) as string[]).length : 0
      const total = course.metadata?.lessons?.length || 0
      return { slug: course.slug, completed, total }
    }).filter(p => p.completed > 0) // Only show courses with progress
    
    setProgressData(data)
  }, [courses])
  
  if (!isClient || progressData.length === 0) {
    return null
  }
  
  const totalCompleted = progressData.reduce((sum, p) => sum + p.completed, 0)
  const totalLessons = progressData.reduce((sum, p) => sum + p.total, 0)
  const coursesInProgress = progressData.filter(p => p.completed < p.total).length
  const coursesCompleted = progressData.filter(p => p.completed === p.total && p.total > 0).length
  
  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 border-y border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
              <p className="text-navy-400">Pick up where you left off</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{totalCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
            <div className="w-px h-10 bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{coursesInProgress}</div>
              <div className="text-xs text-navy-400">In Progress</div>
            </div>
            <div className="w-px h-10 bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{coursesCompleted}</div>
              <div className="text-xs text-navy-400">Completed</div>
            </div>
          </div>
        </div>
        
        {/* Course Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressData.slice(0, 3).map(progress => {
            const course = courses.find(c => c.slug === progress.slug)
            if (!course) return null
            
            const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
            const isComplete = progress.completed === progress.total && progress.total > 0
            
            return (
              <Link
                key={progress.slug}
                href={`/courses/${course.slug}`}
                className="group bg-navy-800/50 backdrop-blur border border-navy-700 hover:border-primary-500/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="flex items-start gap-4">
                  {course.metadata?.thumbnail ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📚</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isComplete ? 'bg-green-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-navy-400 font-medium">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-navy-400">
                        {progress.completed}/{progress.total} lessons
                      </span>
                      {isComplete && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <span>✓</span> Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}