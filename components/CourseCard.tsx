import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

// Helper function to safely get string value from metafield
function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = getMetafieldValue(metadata?.difficulty)
  const isFree = metadata?.is_free
  const price = metadata?.price
  const estimatedHours = metadata?.estimated_hours
  const thumbnailUrl = metadata?.thumbnail?.imgix_url

  const getDifficultyBadge = () => {
    const diffLower = difficulty.toLowerCase()
    switch (diffLower) {
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

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={`${thumbnailUrl}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        {/* Price/Free Badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <span className="badge badge-free font-bold shadow-lg">FREE</span>
          ) : price ? (
            <span className="badge bg-navy-900/90 text-white font-bold shadow-lg">${price}</span>
          ) : null}
        </div>

        {/* Hover overlay with play icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-500/90 rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-3">
          {getDifficultyBadge()}
          {estimatedHours && (
            <span className="text-sm text-navy-400">{estimatedHours} hours</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-navy-300 text-sm line-clamp-2 mb-4">
            {metadata.tagline}
          </p>
        )}

        {/* Footer with instructor info */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="pt-4 border-t border-navy-800 flex items-center gap-3">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0]?.metadata?.name || 'Instructor'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-sm text-navy-400">
              {metadata.instructors[0]?.metadata?.name || 'Instructor'}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}