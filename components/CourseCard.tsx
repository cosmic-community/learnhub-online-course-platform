import Link from 'next/link'
import type { Course } from '@/types'
import CourseProgressBadge from './CourseProgressBadge'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = metadata?.difficulty?.value || 'beginner'
  const isFree = metadata?.is_free
  const price = metadata?.price
  const lessonsCount = metadata?.lessons?.length || 0

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
    <Link href={`/courses/${course.slug}`} className="card group block relative">
      {/* Progress Badge - Shows if user has started the course */}
      <CourseProgressBadge courseSlug={course.slug} totalLessons={lessonsCount} />
      
      {/* Course Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-4 left-4">
            <span className="badge badge-free">Free</span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((category) => (
              <span key={category.id} className="text-xs text-primary-400">
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

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={`badge ${getDifficultyBadge()}`}>
              {difficulty}
            </span>
            {metadata?.estimated_hours && (
              <span className="text-navy-400">
                {metadata.estimated_hours}h
              </span>
            )}
            {lessonsCount > 0 && (
              <span className="text-navy-400">
                {lessonsCount} lessons
              </span>
            )}
          </div>
          
          {/* Price */}
          {!isFree && price && (
            <span className="font-semibold text-white">
              ${price}
            </span>
          )}
        </div>

        {/* Instructors */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-2">
            {metadata.instructors.slice(0, 1).map((instructor) => (
              <div key={instructor.id} className="flex items-center gap-2">
                {instructor.metadata?.photo?.imgix_url ? (
                  <img
                    src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                    alt={instructor.metadata?.name || instructor.title}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                    <span className="text-sm">👨‍🏫</span>
                  </div>
                )}
                <span className="text-sm text-navy-400">
                  {instructor.metadata?.name || instructor.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}