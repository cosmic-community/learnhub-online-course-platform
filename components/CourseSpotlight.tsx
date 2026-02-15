import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  return (
    <div className="card p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
      {/* Spotlight badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
          <span className="animate-sparkle">✨</span>
          Course of the Day
        </span>
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex gap-6">
        {/* Thumbnail */}
        <div className="hidden sm:block w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300">
          {thumbnail ? (
            <img
              src={`${thumbnail.imgix_url}?w=256&h=256&fit=crop&auto=format,compress`}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
            {course.title}
          </h3>
          
          {metadata?.tagline && (
            <p className="text-navy-400 text-sm mb-4 line-clamp-2">
              {metadata.tagline}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-navy-400 mb-4">
            {metadata?.difficulty && (
              <DifficultyBadge difficulty={metadata.difficulty} size="small" />
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessons.length} lessons
            </span>
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
          </div>
          
          {/* Instructor + CTA */}
          <div className="flex items-center justify-between">
            {instructors.length > 0 && instructors[0] && (
              <div className="flex items-center gap-2">
                {instructors[0].metadata?.photo ? (
                  <img
                    src={`${instructors[0].metadata.photo.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                    alt={instructors[0].metadata?.name || instructors[0].title}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs">
                    👨‍🏫
                  </div>
                )}
                <span className="text-sm text-navy-300">
                  {instructors[0].metadata?.name || instructors[0].title}
                </span>
              </div>
            )}
            
            <Link 
              href={`/courses/${course.slug}`}
              className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1 group/link"
            >
              Start Learning
              <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}