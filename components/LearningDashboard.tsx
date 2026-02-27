'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CourseProgress {
  courseId: string
  courseName: string
  courseSlug: string
  totalLessons: number
  completedLessons: number
  thumbnail?: string
}

interface LearningDashboardProps {
  courses: {
    id: string
    slug: string
    title: string
    metadata?: {
      title?: string
      lessons?: { id: string }[]
      thumbnail?: { imgix_url?: string }
    }
  }[]
}

export default function LearningDashboard({ courses }: LearningDashboardProps) {
  const [progressData, setProgressData] = useState<CourseProgress[]>([])
  const [totalStats, setTotalStats] = useState({
    coursesStarted: 0,
    coursesCompleted: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
  })

  useEffect(() => {
    const loadProgress = () => {
      const progress: CourseProgress[] = courses.map(course => {
        const stored = localStorage.getItem(`progress-${course.id}`)
        const completed = stored ? JSON.parse(stored) : []
        const totalLessons = course.metadata?.lessons?.length || 0
        
        return {
          courseId: course.id,
          courseName: course.metadata?.title || course.title,
          courseSlug: course.slug,
          totalLessons,
          completedLessons: completed.length,
          thumbnail: course.metadata?.thumbnail?.imgix_url,
        }
      }).filter(p => p.completedLessons > 0)

      setProgressData(progress)

      const stats = {
        coursesStarted: progress.length,
        coursesCompleted: progress.filter(p => p.totalLessons > 0 && p.completedLessons >= p.totalLessons).length,
        lessonsCompleted: progress.reduce((acc, p) => acc + p.completedLessons, 0),
        totalLessons: progress.reduce((acc, p) => acc + p.totalLessons, 0),
      }
      setTotalStats(stats)
    }

    loadProgress()

    // Listen for progress updates
    const handleProgressUpdate = () => loadProgress()
    window.addEventListener('progress-updated', handleProgressUpdate)
    window.addEventListener('storage', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('progress-updated', handleProgressUpdate)
      window.removeEventListener('storage', handleProgressUpdate)
    }
  }, [courses])

  if (progressData.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">📚</span>
          <div>
            <h2 className="text-3xl font-bold text-white">Your Learning Journey</h2>
            <p className="text-navy-400">Continue where you left off</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon="🎯" 
            value={totalStats.coursesStarted} 
            label="Courses Started"
            color="primary"
          />
          <StatCard 
            icon="🏆" 
            value={totalStats.coursesCompleted} 
            label="Courses Completed"
            color="green"
          />
          <StatCard 
            icon="📖" 
            value={totalStats.lessonsCompleted} 
            label="Lessons Completed"
            color="yellow"
          />
          <StatCard 
            icon="🔥" 
            value={`${totalStats.totalLessons > 0 ? Math.round((totalStats.lessonsCompleted / totalStats.totalLessons) * 100) : 0}%`} 
            label="Overall Progress"
            color="orange"
          />
        </div>

        {/* Course Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressData.map((course) => {
            const progress = course.totalLessons > 0 
              ? Math.round((course.completedLessons / course.totalLessons) * 100) 
              : 0
            const isCompleted = progress === 100

            return (
              <Link 
                key={course.courseId} 
                href={`/courses/${course.courseSlug}`}
                className="card group p-4 hover:border-primary-500/50"
              >
                <div className="flex gap-4">
                  {course.thumbnail && (
                    <img 
                      src={`${course.thumbnail}?w=160&h=90&fit=crop&auto=format,compress`}
                      alt={course.courseName}
                      className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {course.courseName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${isCompleted ? 'text-green-400' : 'text-primary-400'}`}>
                        {progress}%
                      </span>
                    </div>
                    <p className="text-xs text-navy-500 mt-1">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </p>
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

function StatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: string
  value: number | string
  label: string
  color: 'primary' | 'green' | 'yellow' | 'orange'
}) {
  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <span className="text-2xl">{icon}</span>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
      <div className="text-xs text-navy-400">{label}</div>
    </div>
  )
}