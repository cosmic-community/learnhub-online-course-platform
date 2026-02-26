import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/30 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
            <span className="text-lg">🌱</span>
            Perfect for Beginners
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Quick Start Your Journey
          </h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            New to coding? These beginner-friendly courses will get you started on the right path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative"
            >
              <div className="card p-6 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10">
                {/* Step indicator */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                  {index + 1}
                </div>
                
                {/* Thumbnail */}
                {course.metadata?.thumbnail?.imgix_url && (
                  <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                    {course.metadata?.is_free && (
                      <span className="absolute bottom-2 left-2 badge badge-free text-xs">
                        Free
                      </span>
                    )}
                  </div>
                )}
                
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {course.metadata?.title || course.title}
                </h3>
                
                <p className="text-navy-400 text-sm flex-1 line-clamp-2 mb-4">
                  {course.metadata?.tagline || 'Start learning today'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="badge badge-beginner">Beginner</span>
                  {course.metadata?.estimated_hours && (
                    <span className="text-navy-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.metadata.estimated_hours}h
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/courses" className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-2 group">
            View all beginner courses
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}