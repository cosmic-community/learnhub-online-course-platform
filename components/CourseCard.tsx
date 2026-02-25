import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = metadata?.difficulty?.value || 'beginner'
  const isFree = metadata?.is_free || false
  const price = metadata?.price || 0

  const getDifficultyBadge = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'badge-beginner'
    }
  }

  return (
    <Link href={`/courses/${course.slug}`} className="card group block hover-lift">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <span className="text-5xl opacity-50">📚</span>
          </div>
        )}
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <span className="badge badge-free shadow-lg">Free</span>
          ) : (
            <span className="badge bg-navy-900/90 text-white shadow-lg">${price}</span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <span className="px-4 py-3 text-sm font-medium text-white flex items-center gap-2">
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
      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${getDifficultyBadge()}`}>
            {difficulty}
          </span>
          {metadata?.estimated_hours && (
            <span className="badge bg-navy-700/50 text-navy-300">
              {metadata.estimated_hours}h
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {metadata?.title || course.title}
        </h3>

        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-sm text-navy-400 mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Instructor */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-navy-800">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || ''}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-sm text-navy-400">
              {metadata.instructors[0]?.metadata?.name || metadata.instructors[0]?.title}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}