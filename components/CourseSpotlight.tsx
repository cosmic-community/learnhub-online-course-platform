import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const thumbnail = course.metadata?.thumbnail?.imgix_url
  const instructor = course.metadata?.instructors?.[0]

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl animate-pulse">✨</span>
        <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Course of the Day</span>
        <span className="text-2xl animate-pulse">✨</span>
      </div>
      
      <Link 
        href={`/courses/${course.slug}`}
        className="block group"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10">
          {/* Thumbnail */}
          <div className="relative w-full md:w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
            {thumbnail ? (
              <img
                src={`${thumbnail}?w=512&h=320&fit=crop&auto=format,compress`}
                alt={course.metadata?.title || course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            
            {/* Featured badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ FEATURED
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <DifficultyBadge difficulty={course.metadata?.difficulty?.value || 'Beginner'} />
              {course.metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              {course.metadata?.estimated_hours && (
                <span className="text-navy-400 text-sm">
                  ⏱️ {course.metadata.estimated_hours} hours
                </span>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {course.metadata?.title || course.title}
            </h3>
            
            {course.metadata?.tagline && (
              <p className="text-navy-300 mb-4">{course.metadata.tagline}</p>
            )}
            
            {instructor && (
              <div className="flex items-center justify-center md:justify-start gap-3">
                {instructor.metadata?.photo?.imgix_url ? (
                  <img
                    src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={instructor.metadata?.name || instructor.title}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                    <span className="text-lg">👨‍🏫</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{instructor.metadata?.name || instructor.title}</p>
                  {instructor.metadata?.credentials && (
                    <p className="text-navy-400 text-sm truncate max-w-[200px]">
                      {instructor.metadata.credentials}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="btn-primary group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
              Start Learning
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}