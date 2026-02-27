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
  const [results, setResults] = useState<{
    courses: Course[]
    categories: Category[]
  }>({ courses: [], categories: [] })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
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

    const searchTerm = query.toLowerCase()
    
    const matchedCourses = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.metadata?.tagline?.toLowerCase().includes(searchTerm) ||
      course.metadata?.categories?.some(cat => 
        cat.metadata?.name?.toLowerCase().includes(searchTerm)
      )
    ).slice(0, 4)

    const matchedCategories = categories.filter(cat =>
      cat.metadata?.name?.toLowerCase().includes(searchTerm) ||
      cat.metadata?.description?.toLowerCase().includes(searchTerm)
    ).slice(0, 3)

    setResults({
      courses: matchedCourses,
      categories: matchedCategories
    })
  }, [query, courses, categories])

  const hasResults = results.courses.length > 0 || results.categories.length > 0

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-navy-400 hover:text-navy-200 transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-sm">Quick search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 bg-navy-900 px-2 py-0.5 rounded text-xs text-navy-500 group-hover:text-navy-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-navy-950/80 backdrop-blur-sm">
          <div 
            ref={containerRef}
            className="w-full max-w-2xl mx-4 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-navy-800">
              <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, categories, topics..."
                className="flex-1 py-4 bg-transparent text-white placeholder:text-navy-500 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy-500 hover:text-navy-300 text-sm"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query && !hasResults && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-navy-400">No results found for &quot;{query}&quot;</p>
                  <p className="text-navy-500 text-sm mt-1">Try searching for course names or topics</p>
                </div>
              )}

              {!query && (
                <div className="p-6">
                  <p className="text-sm text-navy-500 mb-4">Recent searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'AWS', 'TypeScript', 'Vue'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-navy-300 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Course results */}
              {results.courses.length > 0 && (
                <div className="p-4">
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-2 px-2">Courses</p>
                  <div className="space-y-1">
                    {results.courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-800 transition-colors group"
                      >
                        {course.metadata?.thumbnail ? (
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt=""
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-navy-700 flex items-center justify-center">
                            📚
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                            {course.title}
                          </p>
                          <p className="text-navy-400 text-sm truncate">
                            {course.metadata?.tagline}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-navy-600 group-hover:text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category results */}
              {results.categories.length > 0 && (
                <div className="p-4 border-t border-navy-800">
                  <p className="text-xs text-navy-500 uppercase tracking-wider mb-2 px-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors"
                      >
                        <span>{category.metadata?.icon}</span>
                        <span className="text-white">{category.metadata?.name}</span>
                      </Link>
                    ))}
                  </div>
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
              <span>Powered by LearnHub</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}