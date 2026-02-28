import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const { metadata } = course
  const difficulty = metadata?.difficulty?.value || 'Beginner'
  const lessonsCount = metadata?.lessons?.length || 0
  const instructor = metadata?.instructors?.[0]

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      
      <div className="relative bg-navy-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-2/5 relative overflow-hidden">
            {metadata?.thumbnail?.imgix_url ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-64 lg:h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
            
            {/* Spotlight badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <span>⭐</span> Today&apos;s Pick
            </div>
          </div>
          
          {/* Content Section */}
          <div className="lg:w-3/5 p-6 lg:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge ${
                difficulty === 'Beginner' ? 'badge-beginner' :
                difficulty === 'Intermediate' ? 'badge-intermediate' :
                'badge-advanced'
              }`}>
                {difficulty}
              </span>
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              {metadata?.categories?.[0] && (
                <span className="badge bg-navy-700 text-navy-200">
                  {metadata.categories[0].metadata?.name || metadata.categories[0].title}
                </span>
              )}
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
              {metadata?.title || course.title}
            </h3>
            
            <p className="text-navy-300 mb-4 line-clamp-2">
              {metadata?.tagline || 'Start your learning journey with this course'}
            </p>
            
            {/* Instructor */}
            {instructor && (
              <div className="flex items-center gap-3 mb-6">
                {instructor.metadata?.photo?.imgix_url ? (
                  <img
                    src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={instructor.metadata?.name || instructor.title}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span>👨‍🏫</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">
                    {instructor.metadata?.name || instructor.title}
                  </p>
                  <p className="text-navy-400 text-xs">Instructor</p>
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {metadata?.estimated_hours && (
                <div className="flex items-center gap-1 text-navy-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours}h
                </div>
              )}
              <div className="flex items-center gap-1 text-navy-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {lessonsCount} lessons
              </div>
              {!metadata?.is_free && metadata?.price && (
                <div className="text-white font-semibold">
                  ${metadata.price}
                </div>
              )}
            </div>
            
            {/* CTA */}
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
            >
              Start Learning Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}