import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = metadata?.difficulty?.value || metadata?.difficulty?.key || 'beginner'
  const lessonsCount = metadata?.lessons?.length || 0
  const estimatedHours = metadata?.estimated_hours || 0
  const price = metadata?.price || 0
  const isFree = metadata?.is_free || price === 0

  const getDifficultyBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
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
    <Link href={`/courses/${course.slug}`} className="card group block hover:scale-[1.02] transition-transform duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
            alt={metadata.title || course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <span className="text-6xl opacity-50">📚</span>
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <span className="badge badge-free">Free</span>
          ) : (
            <span className="badge bg-navy-900/90 text-white">
              ${price}
            </span>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((category) => (
              <span 
                key={category.id} 
                className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-full"
              >
                {category.metadata?.name || category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Instructor */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {metadata.instructors[0].metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata.name || ''}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
            )}
            <span className="text-sm text-navy-300">
              {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <div className="flex items-center gap-4 text-sm text-navy-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessonsCount} lessons
            </span>
            {estimatedHours > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estimatedHours}h
              </span>
            )}
          </div>
          <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}