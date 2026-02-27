import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const instructor = metadata?.instructors?.[0]
  const category = metadata?.categories?.[0]
  
  // Calculate total lessons
  const lessonCount = metadata?.lessons?.length || 0
  
  // Get difficulty badge class
  const difficultyClass = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate', 
    advanced: 'badge-advanced'
  }[metadata?.difficulty?.value?.toLowerCase() || 'beginner'] || 'badge-beginner'

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free">Free</span>
          )}
          <span className={`badge ${difficultyClass}`}>
            {metadata?.difficulty?.value || 'Beginner'}
          </span>
        </div>
        
        {/* Duration badge */}
        {metadata?.estimated_hours && (
          <div className="absolute bottom-3 right-3 bg-navy-950/80 backdrop-blur-sm px-2 py-1 rounded text-sm text-white">
            {metadata.estimated_hours}h
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {category && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{category.metadata?.icon}</span>
            <span className="text-sm text-navy-400">{category.metadata?.name || category.title}</span>
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {metadata?.title || course.title}
        </h3>
        
        {/* Tagline */}
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">{metadata.tagline}</p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          {/* Instructor */}
          <div className="flex items-center gap-2">
            {instructor?.metadata?.photo?.imgix_url ? (
              <img
                src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={instructor.metadata?.name || instructor.title}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs">
                👨‍🏫
              </div>
            )}
            <span className="text-sm text-navy-300 truncate max-w-[120px]">
              {instructor?.metadata?.name || instructor?.title || 'Instructor'}
            </span>
          </div>
          
          {/* Lessons count */}
          <div className="flex items-center gap-2 text-navy-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {metadata?.is_free ? (
              <span className="text-primary-400">Free</span>
            ) : (
              `$${metadata?.price || 0}`
            )}
          </span>
          <span className="text-primary-400 text-sm font-medium group-hover:underline">
            View Course →
          </span>
        </div>
      </div>
    </Link>
  )
}