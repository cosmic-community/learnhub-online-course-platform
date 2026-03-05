import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

function getDifficultyBadge(difficulty: string | { key?: string; value?: string } | undefined): { class: string; label: string } {
  const difficultyValue = typeof difficulty === 'object' ? difficulty?.value?.toLowerCase() : difficulty?.toLowerCase()
  
  switch (difficultyValue) {
    case 'beginner':
      return { class: 'badge-beginner', label: 'Beginner' }
    case 'intermediate':
      return { class: 'badge-intermediate', label: 'Intermediate' }
    case 'advanced':
      return { class: 'badge-advanced', label: 'Advanced' }
    default:
      return { class: 'badge-beginner', label: 'Beginner' }
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficultyBadge = getDifficultyBadge(metadata?.difficulty)
  const thumbnail = metadata?.thumbnail?.imgix_url
  const price = metadata?.price || 0
  const isFree = metadata?.is_free || price === 0
  const estimatedHours = metadata?.estimated_hours || 0
  const lessonsCount = metadata?.lessons?.length || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={`${thumbnail}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`badge ${difficultyBadge.class}`}>
            {difficultyBadge.label}
          </span>
          {isFree && (
            <span className="badge badge-free">Free</span>
          )}
        </div>

        {/* Hover overlay with progress hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="text-white font-medium flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </span>
            Start Learning
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-navy-400">
          <div className="flex items-center gap-4">
            {lessonsCount > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {lessonsCount} lessons
              </span>
            )}
            {estimatedHours > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estimatedHours}h
              </span>
            )}
          </div>
          
          {!isFree && (
            <span className="text-primary-400 font-semibold">
              ${price}
            </span>
          )}
        </div>

        {/* Instructor preview */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center gap-2">
              {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
                <img
                  src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={metadata.instructors[0]?.metadata?.name || 'Instructor'}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs">
                  👨‍🏫
                </div>
              )}
              <span className="text-sm text-navy-300">
                {metadata.instructors[0]?.metadata?.name || metadata.instructors[0]?.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}