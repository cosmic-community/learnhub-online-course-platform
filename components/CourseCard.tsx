import Link from 'next/link'
import type { Course } from '@/types'
import CourseProgressBadge from './CourseProgressBadge'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  
  const difficultyColors: Record<string, string> = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  }

  const difficultyValue = metadata?.difficulty?.value?.toLowerCase() || 'beginner'
  const lessonsCount = metadata?.lessons?.length || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block relative">
      {/* Progress Badge (shows only if user has started the course) */}
      <CourseProgressBadge courseId={course.id} compact />
      
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
        
        {/* Price/Free badge */}
        <div className="absolute top-3 right-3">
          {metadata?.is_free ? (
            <span className="badge badge-free">Free</span>
          ) : (
            <span className="badge bg-navy-900/80 text-white">
              ${metadata?.price || 0}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          {metadata?.categories?.[0] && (
            <span className="text-xs text-navy-400">
              {metadata.categories[0].metadata?.icon} {metadata.categories[0].metadata?.name || metadata.categories[0].title}
            </span>
          )}
          <span className="text-navy-700">•</span>
          <span className={`badge ${difficultyColors[difficultyValue] || 'badge-beginner'}`}>
            {metadata?.difficulty?.value || 'Beginner'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">{metadata.tagline}</p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-navy-400">
          <div className="flex items-center gap-4">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessonsCount} lessons
            </span>
          </div>

          {/* Instructor avatar */}
          {metadata?.instructors?.[0]?.metadata?.photo?.imgix_url && (
            <img
              src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
              alt={metadata.instructors[0].metadata?.name || ''}
              className="w-8 h-8 rounded-full border-2 border-navy-700"
            />
          )}
        </div>
        
        {/* Course Progress (non-compact version for card bottom) */}
        <CourseProgressBadge courseId={course.id} />
      </div>
    </Link>
  )
}