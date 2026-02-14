import Link from 'next/link'
import type { Course } from '@/types'

interface CourseOfTheDayProps {
  courses: Course[]
}

export default function CourseOfTheDay({ courses }: CourseOfTheDayProps) {
  if (!courses || courses.length === 0) return null

  // Deterministically select a course based on the current date
  // This ensures all users see the same "Course of the Day"
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const courseIndex = dayOfYear % courses.length
  const course = courses[courseIndex]

  if (!course) return null

  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/80 border border-primary-500/20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="relative p-8 lg:p-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          <span className="text-primary-300 text-sm font-medium">Course of the Day</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {course.title}
            </h2>
            
            {metadata?.tagline && (
              <p className="text-lg text-navy-300 mb-6">
                {metadata.tagline}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {metadata?.difficulty && (
                <span className={`badge ${
                  metadata.difficulty.value === 'Beginner' ? 'badge-beginner' :
                  metadata.difficulty.value === 'Intermediate' ? 'badge-intermediate' :
                  'badge-advanced'
                }`}>
                  {metadata.difficulty.value}
                </span>
              )}
              
              <span className="text-navy-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {lessons.length} lessons
              </span>
              
              {metadata?.estimated_hours && (
                <span className="text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours} hours
                </span>
              )}
            </div>

            {/* Instructor */}
            {instructors.length > 0 && instructors[0] && (
              <div className="flex items-center gap-3 mb-8">
                {instructors[0].metadata?.photo ? (
                  <img
                    src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                    alt={instructors[0].metadata?.name || instructors[0].title}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl border-2 border-primary-500/30">
                    👨‍🏫
                  </div>
                )}
                <div>
                  <div className="text-white font-medium">
                    {instructors[0].metadata?.name || instructors[0].title}
                  </div>
                  {instructors[0].metadata?.credentials && (
                    <div className="text-navy-400 text-sm line-clamp-1">
                      {instructors[0].metadata.credentials}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link href={`/courses/${course.slug}`} className="btn-primary">
                Start Learning Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <div className="flex items-center gap-2">
                {metadata?.is_free ? (
                  <span className="text-2xl font-bold text-primary-400">Free</span>
                ) : (
                  <span className="text-2xl font-bold text-white">${metadata?.price || 0}</span>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-navy-700">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-7xl">📚</span>
                </div>
              )}
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30 group-hover:bg-navy-950/40 transition-colors">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}