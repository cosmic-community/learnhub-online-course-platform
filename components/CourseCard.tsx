import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  
  const getDifficultyClass = (difficulty: string | { key?: string; value?: string } | undefined) => {
    const diffValue = typeof difficulty === 'object' ? difficulty?.value : difficulty
    const normalizedDiff = diffValue?.toLowerCase() || 'beginner'
    
    switch (normalizedDiff) {
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

  const getDifficultyLabel = (difficulty: string | { key?: string; value?: string } | undefined): string => {
    if (typeof difficulty === 'object' && difficulty !== null) {
      return difficulty.value || 'Beginner'
    }
    return difficulty || 'Beginner'
  }

  const formatPrice = (price: number | undefined, isFree: boolean | undefined) => {
    if (isFree || !price || price === 0) {
      return <span className="badge badge-free">Free</span>
    }
    return <span className="text-white font-bold">${price}</span>
  }

  return (
    <Link href={`/courses/${course.slug}`} className="card group block h-full">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-navy-800">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover card-image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-navy-800 to-navy-900">
            📚
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-primary-500/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${getDifficultyClass(metadata?.difficulty)}`}>
            {getDifficultyLabel(metadata?.difficulty)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-navy-400">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons && metadata.lessons.length > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            )}
          </div>
          
          {formatPrice(metadata?.price, metadata?.is_free)}
        </div>

        {/* Instructor */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-2">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || ''}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm">
                👨‍🏫
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