import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const difficulty = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  const getDifficultyBadge = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'bg-navy-700 text-navy-200'
    }
  }

  const totalLessons = metadata?.lessons?.length || 0
  const totalMinutes = metadata?.lessons?.reduce((acc, lesson) => 
    acc + (lesson?.metadata?.duration_minutes || 0), 0
  ) || 0

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-navy-800">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-purple-500/20">
            <span className="text-5xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free text-xs">
              FREE
            </span>
          )}
          {difficulty && (
            <span className={`badge ${getDifficultyBadge(difficulty)} text-xs`}>
              {difficulty}
            </span>
          )}
        </div>

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy-950/40">
          <div className="w-16 h-16 rounded-full bg-primary-500/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
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

        {/* Course stats */}
        <div className="flex items-center gap-4 text-sm text-navy-400 mb-4">
          {totalLessons > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {totalLessons} lessons
            </span>
          )}
          {metadata?.estimated_hours && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {metadata.estimated_hours}h
            </span>
          )}
        </div>

        {/* Instructor */}
        {metadata?.instructors?.[0] && (
          <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
            {metadata.instructors[0].metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-sm text-navy-300">
              {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          {metadata?.is_free ? (
            <span className="text-lg font-bold text-green-400">Free</span>
          ) : metadata?.price ? (
            <span className="text-lg font-bold text-white">${metadata.price}</span>
          ) : (
            <span className="text-lg font-bold text-white">Free</span>
          )}
          
          <span className="text-primary-400 text-sm font-medium group-hover:underline flex items-center gap-1">
            Learn more
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}