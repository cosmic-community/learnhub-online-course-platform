import Link from 'next/link'
import type { Course } from '@/types'
import ProgressRing from './ProgressRing'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
  progress?: number
}

function getDifficultyValue(difficulty: Course['metadata']['difficulty']): string {
  if (!difficulty) return 'beginner'
  if (typeof difficulty === 'string') return difficulty.toLowerCase()
  if (typeof difficulty === 'object' && difficulty.value) {
    return difficulty.value.toLowerCase()
  }
  return 'beginner'
}

export default function CourseCard({ course, showProgress = false, progress = 0 }: CourseCardProps) {
  const { metadata } = course
  const difficultyValue = getDifficultyValue(metadata?.difficulty)

  return (
    <Link href={`/courses/${course.slug}`} className="card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
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
        
        {/* Progress Ring Overlay */}
        {showProgress && progress > 0 && (
          <div className="absolute top-3 right-3">
            <ProgressRing progress={progress} size={40} strokeWidth={3} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free backdrop-blur-sm">
              Free
            </span>
          )}
          <span className={`badge backdrop-blur-sm badge-${difficultyValue}`}>
            {difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((cat) => (
              <span key={cat.id} className="text-xs text-primary-400 font-medium">
                {cat.metadata?.icon} {cat.metadata?.name || cat.title}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        <p className="text-navy-400 text-sm mb-4 line-clamp-2">
          {metadata?.tagline}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-navy-500">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            )}
          </div>
          
          {!metadata?.is_free && metadata?.price && (
            <span className="font-bold text-white">
              ${metadata.price}
            </span>
          )}
        </div>

        {/* Instructors */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {metadata.instructors.slice(0, 3).map((instructor) => (
                  <div key={instructor.id} className="w-8 h-8 rounded-full border-2 border-navy-900 overflow-hidden">
                    {instructor.metadata?.photo?.imgix_url ? (
                      <img
                        src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                        alt={instructor.metadata.name || instructor.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500/20 flex items-center justify-center text-xs">
                        {(instructor.metadata?.name || instructor.title)?.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-navy-400">
                {metadata.instructors.map(i => i.metadata?.name || i.title).join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}