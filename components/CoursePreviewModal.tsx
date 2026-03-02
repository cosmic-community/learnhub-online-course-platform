'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Lesson } from '@/types'

interface CoursePreviewModalProps {
  course: Course
  isOpen: boolean
  onClose: () => void
}

export default function CoursePreviewModal({ course, isOpen, onClose }: CoursePreviewModalProps) {
  const [mounted, setMounted] = useState(false)
  const { metadata } = course

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!mounted || !isOpen) return null

  const lessons = (metadata?.lessons as Lesson[]) || []
  const instructors = metadata?.instructors || []
  const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.metadata?.duration_minutes || 0), 0)
  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="fixed inset-4 md:inset-10 lg:inset-20 bg-navy-900 rounded-2xl overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-48 md:h-64">
          {metadata?.thumbnail?.imgix_url ? (
            <img 
              src={`${metadata.thumbnail.imgix_url}?w=1200&h=400&fit=crop&auto=format,compress`}
              alt={metadata.title || course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-navy-900/80 hover:bg-navy-800 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              {metadata?.difficulty?.value && (
                <span className={`badge badge-${metadata.difficulty.value.toLowerCase()}`}>
                  {metadata.difficulty.value}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {metadata?.title || course.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="md:col-span-2 space-y-6">
              {metadata?.tagline && (
                <p className="text-lg text-navy-300">{metadata.tagline}</p>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}</span>
                </div>
                <div className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{lessons.length} lessons</span>
                </div>
                {!metadata?.is_free && metadata?.price && (
                  <div className="flex items-center gap-2 text-primary-400 font-semibold">
                    <span>${metadata.price}</span>
                  </div>
                )}
              </div>

              {/* Lesson preview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">What you&apos;ll learn</h3>
                <div className="space-y-2">
                  {lessons.slice(0, 5).map((lesson, index) => (
                    <div key={lesson.id || index} className="flex items-center gap-3 p-3 bg-navy-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate">{lesson.metadata?.title || lesson.title}</p>
                        {lesson.metadata?.duration_minutes && (
                          <p className="text-navy-400 text-sm">{lesson.metadata.duration_minutes} min</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {lessons.length > 5 && (
                    <p className="text-navy-400 text-sm text-center py-2">
                      + {lessons.length - 5} more lessons
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructors */}
              {instructors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Instructors</h3>
                  <div className="space-y-3">
                    {instructors.map((instructor: Lesson) => (
                      <div key={instructor.id} className="flex items-center gap-3">
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img 
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                            {(instructor.metadata?.name || instructor.title || '?')[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {instructor.metadata?.name || instructor.title}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-navy-400 text-xs truncate max-w-[180px]">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3 pt-4">
                <Link 
                  href={`/courses/${course.slug}`}
                  className="btn-primary w-full justify-center"
                >
                  View Full Course
                </Link>
                {lessons.length > 0 && lessons[0] && (
                  <Link 
                    href={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
                    className="btn-secondary w-full justify-center"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}