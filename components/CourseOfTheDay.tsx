import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseOfTheDayProps {
  course: Course
}

export default function CourseOfTheDay({ course }: CourseOfTheDayProps) {
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []
  const firstInstructor = instructors[0]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-600/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full">
            <span className="text-xl">⭐</span>
            <span className="text-amber-400 font-semibold">Course of the Day</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 to-transparent" />
        </div>
        
        <div className="card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative aspect-video md:aspect-auto">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-7xl">📚</span>
                </div>
              )}
              
              {/* Overlay with play button effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : (
                  <span className="badge bg-navy-900/90 text-white">
                    ${metadata?.price || 0}
                  </span>
                )}
              </div>
            </div>
            
            {/* Content Side */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                <span className="text-navy-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
                {metadata?.estimated_hours && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {course.title}
              </h3>
              
              {metadata?.tagline && (
                <p className="text-navy-300 text-lg mb-6">
                  {metadata.tagline}
                </p>
              )}
              
              {/* Instructor */}
              {firstInstructor && (
                <div className="flex items-center gap-3 mb-6">
                  {firstInstructor.metadata?.photo ? (
                    <img
                      src={`${firstInstructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                      alt={firstInstructor.metadata?.name || firstInstructor.title}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl ring-2 ring-primary-500/30">
                      👨‍🏫
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {firstInstructor.metadata?.name || firstInstructor.title}
                    </p>
                    {firstInstructor.metadata?.credentials && (
                      <p className="text-navy-400 text-sm">
                        {firstInstructor.metadata.credentials.split(',')[0]}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <Link 
                href={`/courses/${course.slug}`} 
                className="btn-primary inline-flex items-center gap-2 self-start group"
              >
                <span>Start Learning Today</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}