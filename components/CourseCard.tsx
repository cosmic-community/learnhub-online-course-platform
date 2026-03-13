import Link from 'next/link'
import type { Course, Instructor, Category } from '@/types'

interface CourseCardProps {
  course: Course
}

function getDifficultyValue(difficulty: string | { key?: string; value?: string } | undefined): string {
  if (!difficulty) return 'Beginner'
  if (typeof difficulty === 'string') return difficulty
  return difficulty.value || difficulty.key || 'Beginner'
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const instructors = (metadata?.instructors || []) as Instructor[]
  const categories = (metadata?.categories || []) as Category[]
  const difficultyValue = getDifficultyValue(metadata?.difficulty)

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card group block hover:scale-[1.02] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {metadata?.is_free ? (
            <span className="badge badge-free shadow-lg">Free</span>
          ) : metadata?.price ? (
            <span className="badge bg-navy-900/80 text-white shadow-lg">${metadata.price}</span>
          ) : null}
        </div>

        {/* Category Badge */}
        {categories.length > 0 && categories[0]?.metadata && (
          <div className="absolute top-4 left-4">
            <span className="badge bg-navy-900/80 text-white shadow-lg">
              {categories[0].metadata.icon} {categories[0].metadata.name}
            </span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge badge-${difficultyValue.toLowerCase()}`}>
            {difficultyValue}
          </span>
          {metadata?.estimated_hours && (
            <span className="text-navy-500 text-sm">
              {metadata.estimated_hours}h
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

        {/* Instructor */}
        {instructors.length > 0 && instructors[0]?.metadata && (
          <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
            {instructors[0].metadata.photo?.imgix_url ? (
              <img
                src={`${instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={instructors[0].metadata.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-navy-400 text-sm">
              {instructors[0].metadata.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}