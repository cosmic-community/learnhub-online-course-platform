import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = metadata?.difficulty?.value || 'Beginner'
  const isFree = metadata?.is_free || metadata?.price === 0

  const getDifficultyClass = (level: string): string => {
    switch (level?.toLowerCase()) {
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
    <Link href={`/courses/${course.slug}`} className="card group block card-lift glow-on-hover">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`badge ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </span>
          {isFree && (
            <span className="badge badge-free">Free</span>
          )}
        </div>

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-8 h-8 text-navy-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-navy-500">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons?.length ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            ) : null}
          </div>
          
          {!isFree && metadata?.price && (
            <span className="text-white font-semibold">
              ${metadata.price}
            </span>
          )}
        </div>

        {/* Instructor preview */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-3">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-medium">
                {(metadata.instructors[0].metadata?.name || metadata.instructors[0].title || 'I').charAt(0)}
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