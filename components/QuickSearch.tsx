'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickSearchProps {
  courses: Course[]
  categories: Category[]
}

export default function QuickSearch({ courses, categories }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ courses: Course[], categories: Category[] }>({ courses: [], categories: [] })
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut to open search
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

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults({ courses: [], categories: [] })
      return
    }

    const lowerQuery = query.toLowerCase()
    
    const matchedCourses = courses.filter(course => 
      course.title.toLowerCase().includes(lowerQuery) ||
      course.metadata?.tagline?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5)

    const matchedCategories = categories.filter(category =>
      category.title.toLowerCase().includes(lowerQuery) ||
      category.metadata?.name?.toLowerCase().includes(lowerQuery)
    ).slice(0, 3)

    setResults({ courses: matchedCourses, categories: matchedCategories })
  }, [query, courses, categories])

  const hasResults = results.courses.length > 0 || results.categories.length > 0

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg text-navy-400 hover:text-white transition-all group"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Quick search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-navy-900 rounded text-xs text-navy-500 group-hover:text-navy-400">
          <span className="text-base">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
            <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 border-b border-navy-800">
                <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, categories..."
                  className="flex-1 py-4 bg-transparent text-white placeholder-navy-500 focus:outline-none text-lg"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 text-xs text-navy-500 hover:text-navy-300 bg-navy-800 rounded"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim() === '' ? (
                  <div className="p-8 text-center text-navy-500">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <p>Start typing to search courses and categories</p>
                  </div>
                ) : !hasResults ? (
                  <div className="p-8 text-center text-navy-500">
                    <span className="text-4xl mb-4 block">😕</span>
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Categories */}
                    {results.categories.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Categories</h3>
                        {results.categories.map(category => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 hover:bg-navy-800 rounded-lg transition-colors"
                          >
                            <span className="text-2xl">{category.metadata?.icon || '📁'}</span>
                            <div>
                              <p className="text-white font-medium">{category.metadata?.name || category.title}</p>
                              {category.metadata?.description && (
                                <p className="text-sm text-navy-400 line-clamp-1">{category.metadata.description}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Courses */}
                    {results.courses.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Courses</h3>
                        {results.courses.map(course => (
                          <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 hover:bg-navy-800 rounded-lg transition-colors"
                          >
                            {course.metadata?.thumbnail ? (
                              <img
                                src={`${course.metadata.thumbnail.imgix_url}?w=96&h=54&fit=crop&auto=format,compress`}
                                alt=""
                                className="w-12 h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-12 h-8 rounded bg-navy-700 flex items-center justify-center">
                                📚
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{course.title}</p>
                              {course.metadata?.tagline && (
                                <p className="text-sm text-navy-400 truncate">{course.metadata.tagline}</p>
                              )}
                            </div>
                            {course.metadata?.is_free && (
                              <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-400 rounded">Free</span>
                            )}
                          </Link>
                        ))}
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
        </div>
      )}
    </>
  )
}