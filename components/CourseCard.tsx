import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const thumbnail = course.metadata?.thumbnail?.imgix_url
  const instructor = course.metadata?.instructors?.[0]
  const lessonCount = course.metadata?.lessons?.length || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={`${thumbnail}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={course.metadata?.title || course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {course.metadata?.is_free ? (
            <span className="px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-full shadow-lg">
              Free
            </span>
          ) : course.metadata?.price ? (
            <span className="px-3 py-1 bg-navy-900/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg">
              ${course.metadata.price}
            </span>
          ) : null}
        </div>
        
        {/* Lesson count */}
        {lessonCount > 0 && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-navy-900/90 backdrop-blur-sm text-white text-sm rounded-full">
              📖 {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <DifficultyBadge difficulty={course.metadata?.difficulty?.value || 'Beginner'} />
          {course.metadata?.estimated_hours && (
            <span className="text-navy-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.metadata.estimated_hours}h
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {course.metadata?.title || course.title}
        </h3>
        
        {/* Tagline */}
        {course.metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {course.metadata.tagline}
          </p>
        )}
        
        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
            {instructor.metadata?.photo?.imgix_url ? (
              <img
                src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={instructor.metadata?.name || instructor.title}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-navy-700 group-hover:ring-primary-500/50 transition-all"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-lg">👨‍🏫</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {instructor.metadata?.name || instructor.title}
              </p>
              {instructor.metadata?.credentials && (
                <p className="text-navy-500 text-xs truncate">
                  {instructor.metadata.credentials}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}