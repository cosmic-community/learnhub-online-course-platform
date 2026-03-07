'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCoursesInProgress, calculateProgressPercentage, type CourseProgress } from '@/lib/progress'
import type { Course } from '@/types'

interface ContinueLearningProps {
  courses: Course[]
}

interface CourseWithProgress extends Course {
  progress: CourseProgress
  percentage: number
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [inProgressCourses, setInProgressCourses] = useState<CourseWithProgress[]>([])

  useEffect(() => {
    const progressData = getCoursesInProgress()
    
    const coursesWithProgress: CourseWithProgress[] = progressData
      .map((progress) => {
        const course = courses.find((c) => c.slug === progress.courseSlug)
        if (!course) return null
        
        const totalLessons = course.metadata?.lessons?.length || 0
        const percentage = calculateProgressPercentage(progress.completedLessons, totalLessons)
        
        // Only show if not completed and has progress
        if (percentage === 100 || percentage === 0) return null
        
        return {
          ...course,
          progress,
          percentage,
        }
      })
      .filter((c): c is CourseWithProgress => c !== null)
      .slice(0, 3) // Show max 3 courses
    
    setInProgressCourses(coursesWithProgress)
  }, [courses])

  if (inProgressCourses.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-navy-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgressCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="card p-5 group hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800">
                  {course.metadata?.thumbnail?.imgix_url ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📚
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-sm text-navy-400 mt-1">
                    {course.progress.completedLessons.length} of {course.metadata?.lessons?.length || 0} lessons
                  </p>
                  
                  {/* Mini progress bar */}
                  <div className="mt-3 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-primary-400 mt-1 font-medium">
                    {course.percentage}% complete
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}