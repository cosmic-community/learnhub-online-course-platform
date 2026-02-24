import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  
  const getDifficultyBadge = (difficulty: string | undefined | { key?: string; value?: string }) => {
    // Handle both string and object types for difficulty
    let diffValue: string | undefined
    if (typeof difficulty === 'object' && difficulty !== null) {
      diffValue = difficulty.value || difficulty.key
    } else {
      diffValue = difficulty
    }
    
    const normalized = diffValue?.toLowerCase() || ''
    switch (normalized) {
      case 'beginner':
        return <span className="badge badge-beginner">Beginner</span>
      case 'intermediate':
        return <span className="badge badge-intermediate">Intermediate</span>
      case 'advanced':
        return <span className="badge badge-advanced">Advanced</span>
      default:
        return null
    }
  }

  const thumbnailUrl = metadata?.thumbnail?.imgix_url 
    ? `${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`
    : null

  const lessonCount = metadata?.lessons?.length || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free">
              <span className="mr-1">✨</span>
              Free
            </span>
          )}
          {getDifficultyBadge(metadata?.difficulty)}
        </div>

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-primary-500/90 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">{metadata.tagline}</p>
        )}
        
        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-navy-500">
          {metadata?.estimated_hours && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {metadata.estimated_hours}h
            </span>
          )}
          {lessonCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {lessonCount} lessons
            </span>
          )}
        </div>
        
        {/* Instructor Preview */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center gap-3">
              {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
                <img
                  src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={metadata.instructors[0].metadata?.name || ''}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
              )}
              <div>
                <p className="text-sm text-white">{metadata.instructors[0].metadata?.name || metadata.instructors[0].title}</p>
                <p className="text-xs text-navy-500">Instructor</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          {metadata?.is_free ? (
            <span className="text-lg font-bold text-primary-400">Free</span>
          ) : metadata?.price ? (
            <span className="text-lg font-bold text-white">${metadata.price}</span>
          ) : (
            <span className="text-lg font-bold text-primary-400">Free</span>
          )}
          <span className="text-primary-400 text-sm font-medium group-hover:underline">
            View Course →
          </span>
        </div>
      </div>
    </Link>
  )
}