'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecentCourses, getLearningStats } from '@/lib/progress'
import type { CourseProgress } from '@/types'

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
    </div>
  )
}

function CourseProgressCard({ course }: { course: CourseProgress }) {
  const resumeLink = course.lastLessonSlug 
    ? `/courses/${course.courseSlug}/lessons/${course.lastLessonSlug}`
    : `/courses/${course.courseSlug}`
  
  return (
    <div className="card group p-4 flex items-center gap-4 hover:bg-navy-800/50 transition-all">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-navy-800">
        {course.courseThumbnail ? (
          <img 
            src={`${course.courseThumbnail}?w=160&h=112&fit=crop&auto=format,compress`}
            alt={course.courseTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm truncate group-hover:text-primary-400 transition-colors">
          {course.courseTitle}
        </h4>
        {course.lastLessonTitle && (
          <p className="text-xs text-navy-400 truncate mt-0.5">
            📖 {course.lastLessonTitle}
          </p>
        )}
        <p className="text-xs text-navy-500 mt-1">
          {course.lessonsCompleted} of {course.totalLessons} lessons completed
        </p>
      </div>
      
      {/* Progress Ring */}
      <div className="flex-shrink-0">
        <ProgressRing progress={course.overallProgress} />
      </div>
      
      {/* Resume Button */}
      <Link 
        href={resumeLink}
        className="flex-shrink-0 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        Resume
      </Link>
    </div>
  )
}

export default function ContinueLearning() {
  const [recentCourses, setRecentCourses] = useState<CourseProgress[]>([])
  const [stats, setStats] = useState({ coursesStarted: 0, lessonsCompleted: 0, totalProgress: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Load from localStorage on client
    const courses = getRecentCourses(3)
    const learningStats = getLearningStats()
    setRecentCourses(courses)
    setStats(learningStats)
    setIsLoaded(true)
  }, [])
  
  // Don't render anything if no progress or not loaded yet
  if (!isLoaded || recentCourses.length === 0) {
    return null
  }
  
  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <p className="text-sm text-navy-400">Pick up where you left off</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.coursesStarted}</div>
              <div className="text-xs text-navy-500">Courses</div>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.lessonsCompleted}</div>
              <div className="text-xs text-navy-500">Completed</div>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalProgress}%</div>
              <div className="text-xs text-navy-500">Progress</div>
            </div>
          </div>
        </div>
        
        {/* Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {recentCourses.map((course) => (
            <CourseProgressCard key={course.courseSlug} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}