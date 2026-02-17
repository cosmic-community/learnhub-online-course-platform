'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Course, Category, Instructor } from '@/types'

interface SearchModalProps {
  courses: Course[]
  categories: Category[]
  instructors: Instructor[]
}

export default function SearchModal({ courses, categories, instructors }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Filter results based on query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.metadata?.tagline?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(query.toLowerCase()) ||
    category.metadata?.name?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const filteredInstructors = instructors.filter(instructor =>
    instructor.title.toLowerCase().includes(query.toLowerCase()) ||
    instructor.metadata?.name?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const totalResults = filteredCourses.length + filteredCategories.length + filteredInstructors.length

  // Keyboard shortcut to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle arrow key navigation
  const handleKeyNavigation = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && totalResults > 0) {
      e.preventDefault()
      // Navigate to selected result
      let currentIndex = 0
      
      for (const course of filteredCourses) {
        if (currentIndex === selectedIndex) {
          window.location.href = `/courses/${course.slug}`
          setIsOpen(false)
          return
        }
        currentIndex++
      }
      
      for (const category of filteredCategories) {
        if (currentIndex === selectedIndex) {
          window.location.href = `/categories/${category.slug}`
          setIsOpen(false)
          return
        }
        currentIndex++
      }
      
      for (const instructor of filteredInstructors) {
        if (currentIndex === selectedIndex) {
          window.location.href = `/instructors/${instructor.slug}`
          setIsOpen(false)
          return
        }
        currentIndex++
      }
    }
  }, [totalResults, selectedIndex, filteredCourses, filteredCategories, filteredInstructors])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 rounded-lg text-navy-400 text-sm transition-all hover:border-navy-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-700 rounded text-xs">
          <span>⌘</span>K
        </kbd>
      </button>
    )
  }

  let resultIndex = 0

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 animate-slideDown">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyNavigation}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
            {query.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-navy-400">Start typing to search...</p>
                <p className="text-navy-500 text-sm mt-2">
                  Search across courses, categories, and instructors
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">😕</div>
                <p className="text-navy-400">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-navy-500 text-sm mt-2">
                  Try different keywords or browse all courses
                </p>
              </div>
            ) : (
              <div className="py-2">
                {/* Courses */}
                {filteredCourses.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-navy-500 uppercase tracking-wide">
                      Courses
                    </div>
                    {filteredCourses.map((course) => {
                      const isSelected = resultIndex === selectedIndex
                      const currentResultIndex = resultIndex
                      resultIndex++
                      return (
                        <Link
                          key={course.id}
                          href={`/courses/${course.slug}`}
                          onClick={() => setIsOpen(false)}
                          onMouseEnter={() => setSelectedIndex(currentResultIndex)}
                          className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                            isSelected ? 'bg-primary-500/10' : 'hover:bg-navy-800/50'
                          }`}
                        >
                          {course.metadata?.thumbnail ? (
                            <img
                              src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                              alt={course.title}
                              className="w-16 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-2xl">
                              📚
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">{course.title}</div>
                            {course.metadata?.tagline && (
                              <div className="text-navy-400 text-sm truncate">{course.metadata.tagline}</div>
                            )}
                          </div>
                          {isSelected && (
                            <span className="text-primary-400 text-sm">↵ Enter</span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {/* Categories */}
                {filteredCategories.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-navy-500 uppercase tracking-wide mt-2">
                      Categories
                    </div>
                    {filteredCategories.map((category) => {
                      const isSelected = resultIndex === selectedIndex
                      const currentResultIndex = resultIndex
                      resultIndex++
                      return (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          onMouseEnter={() => setSelectedIndex(currentResultIndex)}
                          className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                            isSelected ? 'bg-primary-500/10' : 'hover:bg-navy-800/50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-xl">
                            {category.metadata?.icon || '📁'}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{category.metadata?.name || category.title}</div>
                          </div>
                          {isSelected && (
                            <span className="text-primary-400 text-sm">↵ Enter</span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {/* Instructors */}
                {filteredInstructors.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-navy-500 uppercase tracking-wide mt-2">
                      Instructors
                    </div>
                    {filteredInstructors.map((instructor) => {
                      const isSelected = resultIndex === selectedIndex
                      const currentResultIndex = resultIndex
                      resultIndex++
                      return (
                        <Link
                          key={instructor.id}
                          href={`/instructors/${instructor.slug}`}
                          onClick={() => setIsOpen(false)}
                          onMouseEnter={() => setSelectedIndex(currentResultIndex)}
                          className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                            isSelected ? 'bg-primary-500/10' : 'hover:bg-navy-800/50'
                          }`}
                        >
                          {instructor.metadata?.photo ? (
                            <img
                              src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                              alt={instructor.metadata?.name || instructor.title}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-xl">
                              👨‍🏫
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium">{instructor.metadata?.name || instructor.title}</div>
                            {instructor.metadata?.credentials && (
                              <div className="text-navy-400 text-sm truncate">{instructor.metadata.credentials}</div>
                            )}
                          </div>
                          {isSelected && (
                            <span className="text-primary-400 text-sm">↵ Enter</span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">esc</kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </>
  )
}