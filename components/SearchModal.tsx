'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface SearchModalProps {
  courses: Course[]
  categories: Category[]
}

export default function SearchModal({ courses, categories }: SearchModalProps) {
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

  const allResults = [
    ...filteredCourses.map(c => ({ type: 'course' as const, item: c })),
    ...filteredCategories.map(c => ({ type: 'category' as const, item: c }))
  ]

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(0)
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
  }, [isOpen])

  // Handle navigation with arrow keys
  const handleKeyNavigation = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      const result = allResults[selectedIndex]
      if (result) {
        const href = result.type === 'course' 
          ? `/courses/${result.item.slug}`
          : `/categories/${result.item.slug}`
        window.location.href = href
      }
    }
  }, [allResults, selectedIndex])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 text-sm hover:bg-navy-800 hover:border-navy-600 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-900 rounded text-xs text-navy-500">
          ⌘K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50"
        onClick={() => {
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
        }}
      />
      
      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNavigation}
              placeholder="Search courses, categories..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-500">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[400px] overflow-y-auto">
            {query && allResults.length === 0 && (
              <div className="px-4 py-8 text-center text-navy-400">
                <p>No results found for "{query}"</p>
              </div>
            )}

            {query && filteredCourses.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-xs text-navy-500 uppercase tracking-wider">
                  Courses
                </div>
                {filteredCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedIndex === index 
                        ? 'bg-primary-500/20 text-white' 
                        : 'hover:bg-navy-800 text-navy-300'
                    }`}
                  >
                    {course.metadata?.thumbnail ? (
                      <img
                        src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format`}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-navy-700 flex items-center justify-center">
                        📚
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{course.title}</div>
                      {course.metadata?.tagline && (
                        <div className="text-sm text-navy-400 truncate">{course.metadata.tagline}</div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}

            {query && filteredCategories.length > 0 && (
              <div className="p-2 border-t border-navy-800">
                <div className="px-2 py-1 text-xs text-navy-500 uppercase tracking-wider">
                  Categories
                </div>
                {filteredCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedIndex === filteredCourses.length + index 
                        ? 'bg-primary-500/20 text-white' 
                        : 'hover:bg-navy-800 text-navy-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-navy-700 flex items-center justify-center text-xl">
                      {category.metadata?.icon || '📂'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{category.metadata?.name || category.title}</div>
                      {category.metadata?.description && (
                        <div className="text-sm text-navy-400 truncate">{category.metadata.description}</div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-4 text-center text-navy-400">
                <p className="mb-2">Start typing to search...</p>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↓</kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">Enter</kbd>
                    <span>Select</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}