'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  courses: Course[]
}

export default function SearchModal({ isOpen, onClose, courses }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Course[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Search logic
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim() === '') {
      setResults([])
      return
    }

    const lowerQuery = searchQuery.toLowerCase()
    const filtered = courses.filter((course) => {
      const title = course.title?.toLowerCase() || ''
      const tagline = course.metadata?.tagline?.toLowerCase() || ''
      const description = course.metadata?.description?.toLowerCase() || ''
      const instructorNames = course.metadata?.instructors?.map(i => 
        (i.metadata?.name || i.title || '').toLowerCase()
      ).join(' ') || ''
      const categoryNames = course.metadata?.categories?.map(c => 
        (c.metadata?.name || c.title || '').toLowerCase()
      ).join(' ') || ''

      return (
        title.includes(lowerQuery) ||
        tagline.includes(lowerQuery) ||
        description.includes(lowerQuery) ||
        instructorNames.includes(lowerQuery) ||
        categoryNames.includes(lowerQuery)
      )
    })

    setResults(filtered.slice(0, 5))
  }, [courses])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
      >
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-navy-800">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search courses, instructors, topics..."
            className="flex-1 bg-transparent text-white placeholder-navy-500 text-lg focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-navy-500 bg-navy-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-navy-400">No courses found for "{query}"</p>
              <p className="text-navy-500 text-sm mt-1">Try different keywords</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-navy-800/50 transition-colors group"
                >
                  {course.metadata?.thumbnail ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center text-xl">
                      📚
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors truncate">
                      {course.title}
                    </h4>
                    {course.metadata?.tagline && (
                      <p className="text-navy-400 text-sm truncate">
                        {course.metadata.tagline}
                      </p>
                    )}
                  </div>
                  <div className="text-navy-500 text-sm">
                    {course.metadata?.is_free ? (
                      <span className="text-primary-400">Free</span>
                    ) : (
                      <span>${course.metadata?.price || 0}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-6">
              <p className="text-navy-500 text-sm mb-3">Quick actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/courses"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors"
                >
                  <span className="text-xl">📚</span>
                  <span className="text-navy-300">Browse All Courses</span>
                </Link>
                <Link
                  href="/categories"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors"
                >
                  <span className="text-xl">🏷️</span>
                  <span className="text-navy-300">Explore Categories</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}