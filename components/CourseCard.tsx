import Link from 'next/link'
import type { Course } from '@/types'
import { getMetafieldValue } from '@/lib/utils'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = getMetafieldValue(metadata?.difficulty)
  const difficultyLower = difficulty.toLowerCase()
  
  const difficultyColor = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  }[difficultyLower] || 'badge-beginner'

  return (
    <Link href={`/courses/${course.slug}`} className="card group block h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {metadata?.is_free ? (
            <span className="badge badge-free">Free</span>
          ) : (
            <span className="badge bg-navy-900/80 text-white backdrop-blur-sm">
              ${metadata?.price || 0}
            </span>
          )}
        </div>
        
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-primary-500/30">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          {metadata?.categories?.[0] && (
            <span className="text-xs text-primary-400 font-medium">
              {metadata.categories[0].metadata?.name || metadata.categories[0].title}
            </span>
          )}
          {metadata?.categories?.[0] && difficulty && (
            <span className="text-navy-600">•</span>
          )}
          {difficulty && (
            <span className={`badge text-xs ${difficultyColor}`}>
              {difficulty}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}
        
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-navy-500">
          {metadata?.estimated_hours && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {metadata.estimated_hours}h
            </span>
          )}
          {metadata?.lessons && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {metadata.lessons.length} lessons
            </span>
          )}
        </div>
        
        {/* Instructor preview */}
        {metadata?.instructors?.[0] && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-3">
            {metadata.instructors[0].metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata.name || ''}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-sm text-navy-400">
              {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}