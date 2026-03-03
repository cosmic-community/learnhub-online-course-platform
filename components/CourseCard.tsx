import Link from 'next/link'
import type { Course } from '@/types'
import CourseProgressBadge from './CourseProgressBadge'

interface CourseCardProps {
  course: Course
}

// Helper function to extract the value from select-dropdown fields
function getSelectValue(field: unknown): string {
  if (typeof field === 'string') return field
  if (field && typeof field === 'object' && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  return ''
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = getSelectValue(metadata?.difficulty)?.toLowerCase() || 'beginner'
  const totalLessons = metadata?.lessons?.length || 0
  
  const difficultyBadgeClass = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  }[difficulty] || 'badge-beginner'

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`badge ${difficultyBadgeClass}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          {metadata?.is_free && (
            <span className="badge badge-free">Free</span>
          )}
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

        {/* Progress Badge (client component) */}
        <CourseProgressBadge 
          courseId={course.id} 
          totalLessons={totalLessons}
          className="mb-4"
        />

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
            {totalLessons > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {totalLessons} lessons
              </span>
            )}
          </div>
          
          {!metadata?.is_free && metadata?.price && (
            <span className="text-white font-semibold">
              ${metadata.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}