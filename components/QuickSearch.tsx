'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickSearchProps {
  courses: Course[]
}

export default function QuickSearch({ courses }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.metadata?.tagline?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setIsOpen(true)
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCourses.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCourses[selectedIndex]) {
      window.location.href = `/courses/${filteredCourses[selectedIndex].slug}`
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-xl text-navy-400 hover:text-white transition-all duration-200 group"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Quick search...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-navy-700/50 rounded text-xs text-navy-400">
          <span className="text-[10px]">⌘</span>K
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
        }}
      />
      
      {/* Search Modal */}
      <div 
        ref={containerRef}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
      >
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
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search courses..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query && filteredCourses.length === 0 ? (
              <div className="px-4 py-8 text-center text-navy-400">
                <span className="text-4xl mb-2 block">🔍</span>
                <p>No courses found for "{query}"</p>
              </div>
            ) : query ? (
              <div className="py-2">
                {filteredCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={`
                      flex items-center gap-4 px-4 py-3 transition-colors
                      ${index === selectedIndex ? 'bg-primary-500/10' : 'hover:bg-navy-800/50'}
                    `}
                  >
                    {course.metadata?.thumbnail ? (
                      <img
                        src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                        alt={course.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{course.title}</h4>
                      {course.metadata?.tagline && (
                        <p className="text-navy-400 text-sm truncate">{course.metadata.tagline}</p>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">↵</kbd>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6">
                <p className="text-navy-500 text-sm mb-3">Popular courses</p>
                {courses.slice(0, 3).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 py-2 text-navy-300 hover:text-white transition-colors"
                  >
                    <span className="text-primary-400">→</span>
                    {course.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd> select
              </span>
            </div>
            <Link 
              href="/courses" 
              onClick={() => setIsOpen(false)}
              className="text-primary-400 hover:text-primary-300"
            >
              View all courses →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}