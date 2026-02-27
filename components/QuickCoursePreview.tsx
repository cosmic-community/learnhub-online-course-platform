'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface QuickCoursePreviewProps {
  course: Course
  children: React.ReactNode
}

export default function QuickCoursePreview({ course, children }: QuickCoursePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []
  
  return (
    <>
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
        
        {/* Quick preview button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
          className="absolute top-4 left-4 z-10 p-2 bg-navy-900/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:scale-110"
          aria-label="Quick preview"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
      
      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div 
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm modal-backdrop"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-navy-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden modal-content border border-navy-700">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-navy-800 rounded-full hover:bg-navy-700 transition-colors"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Thumbnail */}
            <div className="relative aspect-video">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-7xl">📚</span>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
              
              {/* Price badge */}
              <div className="absolute top-4 left-4">
                {metadata?.is_free ? (
                  <span className="badge badge-free text-lg px-4 py-2">Free Course</span>
                ) : (
                  <span className="badge bg-navy-900/90 text-white text-lg px-4 py-2">
                    ${metadata?.price || 0}
                  </span>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {course.title}
                  </h2>
                  {metadata?.tagline && (
                    <p className="text-navy-400">
                      {metadata.tagline}
                    </p>
                  )}
                </div>
                
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{lessons.length}</div>
                  <div className="text-navy-400 text-sm">Lessons</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{metadata?.estimated_hours || '—'}h</div>
                  <div className="text-navy-400 text-sm">Duration</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {instructors.length}
                  </div>
                  <div className="text-navy-400 text-sm">Instructor{instructors.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
              
              {/* Instructor preview */}
              {instructors.length > 0 && instructors[0] && (
                <div className="flex items-center gap-3 mb-6 p-3 bg-navy-800/30 rounded-lg">
                  {instructors[0].metadata?.photo ? (
                    <img
                      src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                      alt={instructors[0].metadata?.name || instructors[0].title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                      👨‍🏫
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {instructors[0].metadata?.name || instructors[0].title}
                    </div>
                    {instructors[0].metadata?.credentials && (
                      <div className="text-navy-400 text-sm line-clamp-1">
                        {instructors[0].metadata.credentials}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Lesson preview */}
              {lessons.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-3">
                    Course Content Preview
                  </h3>
                  <div className="space-y-2">
                    {lessons.slice(0, 3).map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        className="flex items-center gap-3 p-2 bg-navy-800/30 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-sm text-navy-400">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm truncate">
                            {lesson.metadata?.title || lesson.title}
                          </div>
                          {lesson.metadata?.duration_minutes && (
                            <div className="text-navy-500 text-xs">
                              {lesson.metadata.duration_minutes} min
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {lessons.length > 3 && (
                      <div className="text-center text-navy-500 text-sm py-2">
                        +{lessons.length - 3} more lessons
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* CTA */}
              <div className="flex gap-3">
                <Link 
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex-1 justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  View Full Course
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}