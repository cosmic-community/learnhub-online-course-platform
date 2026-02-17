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
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl animate-pulse">✨</span>
          <h2 className="text-2xl font-bold text-white">Course Spotlight</h2>
          <span className="text-3xl animate-pulse" style={{ animationDelay: '500ms' }}>✨</span>
        </div>
        
        <Link 
          href={`/courses/${course.slug}`}
          className="block group"
        >
          <div className="bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 rounded-3xl p-1 hover:from-primary-500/20 hover:to-primary-500/20 transition-all duration-500">
            <div className="bg-navy-950 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
              {/* Thumbnail */}
              <div className="relative w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden">
                {thumbnail ? (
                  <img
                    src={`${thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                    <span className="text-7xl">📚</span>
                  </div>
                )}
                
                {/* Spotlight badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <span className="animate-spin-slow">⭐</span>
                  Featured Today
                </div>
                
                {/* Price */}
                <div className="absolute top-4 right-4">
                  {metadata?.is_free ? (
                    <span className="badge badge-free text-lg px-4 py-2">Free</span>
                  ) : (
                    <span className="badge bg-navy-900/90 text-white text-lg px-4 py-2">
                      ${metadata?.price || 0}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  {metadata?.difficulty && (
                    <DifficultyBadge difficulty={metadata.difficulty} />
                  )}
                  <span className="text-navy-400 text-sm">
                    {lessons.length} lessons • {metadata?.estimated_hours || 0}h
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>
                
                {metadata?.tagline && (
                  <p className="text-navy-300 text-lg mb-6 line-clamp-2">
                    {metadata.tagline}
                  </p>
                )}
                
                {/* Instructor */}
                {instructors.length > 0 && instructors[0] && (
                  <div className="flex items-center gap-4 mb-6">
                    {instructors[0].metadata?.photo ? (
                      <img
                        src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                        alt={instructors[0].metadata?.name || instructors[0].title}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30"
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
                
                <div className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Start Learning</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}