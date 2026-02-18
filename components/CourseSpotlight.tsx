import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/20 via-navy-900 to-navy-950 border border-primary-500/30">
      {/* Spotlight Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-navy-950 px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-yellow-500/25 animate-pulse">
          <span className="text-lg">⭐</span>
          <span>Course of the Day</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px]">
          {thumbnail ? (
            <img
              src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
              <span className="text-8xl">📚</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-900 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {metadata?.difficulty && (
              <DifficultyBadge difficulty={metadata.difficulty} />
            )}
            {metadata?.is_free ? (
              <span className="badge badge-free">Free</span>
            ) : (
              <span className="badge bg-navy-800 text-white">
                ${metadata?.price || 0}
              </span>
            )}
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
            {course.title}
          </h3>

          {metadata?.tagline && (
            <p className="text-navy-300 text-lg mb-6 line-clamp-2">
              {metadata.tagline}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-navy-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{lessons.length} lessons</span>
            </div>
            {metadata?.estimated_hours && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{metadata.estimated_hours} hours</span>
              </div>
            )}
          </div>

          {/* Instructor */}
          {instructors.length > 0 && instructors[0] && (
            <div className="flex items-center gap-3 mb-8">
              {instructors[0].metadata?.photo ? (
                <img
                  src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                  alt={instructors[0].metadata?.name || instructors[0].title}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                  👨‍🏫
                </div>
              )}
              <div>
                <p className="text-white font-medium">
                  {instructors[0].metadata?.name || instructors[0].title}
                </p>
                {instructors[0].metadata?.credentials && (
                  <p className="text-navy-400 text-sm line-clamp-1">
                    {instructors[0].metadata.credentials}
                  </p>
                )}
              </div>
            </div>
          )}

          <Link 
            href={`/courses/${course.slug}`} 
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
          >
            <span>Start Learning Now</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}