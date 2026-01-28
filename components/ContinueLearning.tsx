'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecentCourses, type CourseProgress } from '@/lib/progress'
import ProgressRing from './ProgressRing'

export default function ContinueLearning() {
  const [recentCourses, setRecentCourses] = useState<CourseProgress[]>([])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setRecentCourses(getRecentCourses(3))
  }, [])
  
  if (!mounted || recentCourses.length === 0) {
    return null
  }
  
  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
            <p className="text-navy-400 text-sm">Pick up where you left off</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course) => {
            const progress = course.totalLessons > 0 
              ? Math.round((course.lessonsCompleted / course.totalLessons) * 100)
              : 0
            
            return (
              <Link
                key={course.courseSlug}
                href={course.lastLessonSlug 
                  ? `/courses/${course.courseSlug}/lessons/${course.lastLessonSlug}`
                  : `/courses/${course.courseSlug}`
                }
                className="group relative bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl p-4 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    {course.courseThumbnail ? (
                      <img
                        src={`${course.courseThumbnail}?w=160&h=90&fit=crop&auto=format,compress`}
                        alt={course.courseTitle}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-navy-800 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📚</span>
                      </div>
                    )}
                    {/* Progress ring overlay */}
                    <div className="absolute -bottom-2 -right-2 bg-navy-900 rounded-full p-0.5">
                      <ProgressRing progress={progress} size={28} strokeWidth={2} />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors line-clamp-1">
                      {course.courseTitle}
                    </h3>
                    {course.lastLessonTitle && (
                      <p className="text-xs text-navy-400 mt-1 line-clamp-1">
                        Continue: {course.lastLessonTitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-navy-400 font-medium">
                        {course.lessonsCompleted}/{course.totalLessons}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Resume button */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
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