'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLastAccessedCourse, getUserStats, getCourseProgressPercent, loadProgress } from '@/lib/progress'
import ProgressRing from './ProgressRing'

export default function ContinueLearningBanner() {
  const [lastCourse, setLastCourse] = useState<{ courseSlug: string; courseTitle?: string; progress: number } | null>(null)
  const [stats, setStats] = useState<ReturnType<typeof getUserStats> | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    const course = getLastAccessedCourse()
    if (course) {
      const progress = loadProgress()
      const courseProgress = progress.courses[course.courseSlug]
      const percent = courseProgress 
        ? getCourseProgressPercent(course.courseSlug, courseProgress.totalLessons)
        : 0
      
      setLastCourse({
        courseSlug: course.courseSlug,
        progress: percent,
      })
    }
    
    setStats(getUserStats())
  }, [])
  
  if (!mounted || !stats || stats.totalLessons === 0) {
    return null
  }
  
  return (
    <div className="card p-6 bg-gradient-to-r from-primary-500/10 to-primary-600/5 border-primary-500/30">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Continue learning */}
        <div className="flex items-center gap-4">
          {lastCourse && (
            <ProgressRing progress={lastCourse.progress} size={64} animated={true} />
          )}
          <div>
            <h3 className="font-semibold text-white text-lg mb-1">
              Welcome back! 👋
            </h3>
            <p className="text-navy-400 text-sm">
              {lastCourse ? (
                <>You&apos;re {lastCourse.progress}% through your current course</>
              ) : (
                <>You&apos;ve completed {stats.totalLessons} lessons so far</>
              )}
            </p>
            {lastCourse && (
              <Link
                href={`/courses/${lastCourse.courseSlug}`}
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium mt-2 transition-colors"
              >
                Continue Learning
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
        
        {/* Right: Quick stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.streak}</div>
            <div className="text-xs text-navy-400">🔥 Streak</div>
          </div>
          <div className="w-px h-10 bg-navy-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
            <div className="text-xs text-navy-400">📚 Lessons</div>
          </div>
          <div className="w-px h-10 bg-navy-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.achievements}</div>
            <div className="text-xs text-navy-400">🏆 Awards</div>
          </div>
        </div>
      </div>
    </div>
  )
}