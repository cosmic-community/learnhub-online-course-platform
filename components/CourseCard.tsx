'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Instructor, Category, Lesson } from '@/types'
import CoursePreviewModal from './CoursePreviewModal'

interface CourseCardProps {
  course: Course
  showPreview?: boolean
}

export default function CourseCard({ course, showPreview = true }: CourseCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { metadata } = course

  const instructors = (metadata?.instructors as Instructor[]) || []
  const categories = (metadata?.categories as Category[]) || []
  const lessons = (metadata?.lessons as Lesson[]) || []

  const getDifficultyBadge = () => {
    const difficulty = metadata?.difficulty?.value?.toLowerCase()
    if (difficulty === 'beginner') return 'badge-beginner'
    if (difficulty === 'intermediate') return 'badge-intermediate'
    if (difficulty === 'advanced') return 'badge-advanced'
    return 'bg-navy-700 text-navy-200'
  }

  return (
    <>
      <div className="card group relative">
        {/* Quick Preview Button */}
        {showPreview && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsPreviewOpen(true)
            }}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-navy-900/80 hover:bg-primary-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-90"
            title="Quick Preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}

        <Link href={`/courses/${course.slug}`}>
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            {metadata?.thumbnail?.imgix_url ? (
              <img 
                src={`${metadata.thumbnail.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                alt={metadata.title || course.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              {metadata?.difficulty?.value && (
                <span className={`badge ${getDifficultyBadge()}`}>
                  {metadata.difficulty.value}
                </span>
              )}
            </div>

            {/* Lesson count pill */}
            {lessons.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-navy-900/80 px-2 py-1 rounded text-xs text-white">
                {lessons.length} lessons
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.slice(0, 2).map((cat) => (
                  <span key={cat.id} className="text-xs text-primary-400">
                    {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
              {metadata?.title || course.title}
            </h3>

            {metadata?.tagline && (
              <p className="text-navy-400 text-sm mb-4 line-clamp-2">
                {metadata.tagline}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center justify-between pt-4 border-t border-navy-800">
              {/* Instructors */}
              <div className="flex items-center">
                {instructors.length > 0 ? (
                  <div className="flex -space-x-2">
                    {instructors.slice(0, 3).map((instructor, index) => (
                      <div key={instructor.id || index} className="relative">
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img 
                            src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-8 h-8 rounded-full border-2 border-navy-900 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-navy-900 bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-medium">
                            {(instructor.metadata?.name || instructor.title || '?')[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
                {instructors.length > 0 && (
                  <span className="ml-2 text-sm text-navy-400">
                    {instructors[0]?.metadata?.name || instructors[0]?.title}
                    {instructors.length > 1 && ` +${instructors.length - 1}`}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                {metadata?.is_free ? (
                  <span className="text-green-400 font-semibold">Free</span>
                ) : metadata?.price ? (
                  <span className="text-white font-semibold">${metadata.price}</span>
                ) : null}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Preview Modal */}
      <CoursePreviewModal 
        course={course}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  )
}