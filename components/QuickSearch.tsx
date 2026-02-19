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
  const [results, setResults] = useState<{ courses: Course[]; categories: Category[] }>({ courses: [], categories: [] })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut
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

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
      course.metadata?.tagline?.toLowerCase().includes(lowerQuery) ||
      course.metadata?.description?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5)

    const matchedCategories = categories.filter(category =>
      category.title.toLowerCase().includes(lowerQuery) ||
      category.metadata?.name?.toLowerCase().includes(lowerQuery) ||
      category.metadata?.description?.toLowerCase().includes(lowerQuery)
    ).slice(0, 3)

    setResults({ courses: matchedCourses, categories: matchedCategories })
  }, [query, courses, categories])

  const hasResults = results.courses.length > 0 || results.categories.length > 0

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-navy-800/50 hover:bg-navy-800 text-navy-400 rounded-lg border border-navy-700 transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Quick search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-navy-700 rounded text-navy-400 group-hover:bg-navy-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
          
          {/* Search Container */}
          <div
            ref={containerRef}
            className="relative w-full max-w-2xl bg-navy-900 rounded-2xl border border-navy-700 shadow-2xl overflow-hidden animate-slide-up"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-navy-700">
              <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, categories..."
                className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
              />
              <kbd className="px-2 py-1 text-xs bg-navy-800 rounded text-navy-400">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {!query && (
                <div className="p-6 text-center text-navy-400">
                  <p>Start typing to search...</p>
                  <p className="text-sm mt-2">Find courses, categories, and more</p>
                </div>
              )}

              {query && !hasResults && (
                <div className="p-6 text-center text-navy-400">
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              )}

              {results.categories.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-navy-500 uppercase">Categories</p>
                  {results.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-navy-800 transition-colors"
                    >
                      <span className="text-xl">{category.metadata?.icon || '📁'}</span>
                      <div>
                        <p className="text-white font-medium">{category.metadata?.name || category.title}</p>
                        <p className="text-sm text-navy-400 line-clamp-1">{category.metadata?.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.courses.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-navy-500 uppercase">Courses</p>
                  {results.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-navy-800 transition-colors"
                    >
                      {course.metadata?.thumbnail ? (
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-navy-700 flex items-center justify-center text-xl">
                          📚
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{course.title}</p>
                        <p className="text-sm text-navy-400 truncate">{course.metadata?.tagline}</p>
                      </div>
                      {course.metadata?.is_free && (
                        <span className="badge badge-free text-xs">Free</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-navy-700 flex items-center justify-between text-xs text-navy-500">
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
              <span>Powered by Cosmic</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}