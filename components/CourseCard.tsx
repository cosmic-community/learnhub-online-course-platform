import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  
  const getDifficultyBadge = (difficulty: string | { value?: string } | undefined) => {
    const diffValue = typeof difficulty === 'object' && difficulty !== null ? difficulty.value : difficulty
    switch (diffValue?.toLowerCase()) {
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

  const instructorName = metadata?.instructors?.[0]?.metadata?.name || 'Instructor'
  const instructorPhoto = metadata?.instructors?.[0]?.metadata?.photo?.imgix_url
    ? `${metadata.instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`
    : null

  const lessonCount = metadata?.lessons?.length || 0
  const estimatedHours = metadata?.estimated_hours || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block card-hover-lift">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free">Free</span>
          )}
          {getDifficultyBadge(metadata?.difficulty)}
        </div>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
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
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Course meta */}
        <div className="flex items-center gap-4 text-sm text-navy-400 mb-4">
          {lessonCount > 0 && (
            <span className="flex items-center gap-1">
              <span>📖</span>
              {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          )}
          {estimatedHours > 0 && (
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              {estimatedHours}h
            </span>
          )}
        </div>

        {/* Instructor and price */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <div className="flex items-center gap-2">
            {instructorPhoto ? (
              <img
                src={instructorPhoto}
                alt={instructorName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 text-sm">👤</span>
              </div>
            )}
            <span className="text-navy-300 text-sm">{instructorName}</span>
          </div>
          
          <div className="text-right">
            {metadata?.is_free ? (
              <span className="text-primary-400 font-semibold">Free</span>
            ) : metadata?.price ? (
              <span className="text-white font-semibold">${metadata.price}</span>
            ) : (
              <span className="text-primary-400 font-semibold">Free</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}