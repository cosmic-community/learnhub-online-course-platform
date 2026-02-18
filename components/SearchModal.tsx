'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface SearchModalProps {
  courses: Course[]
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ courses, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const filteredCourses = courses.filter((course) => {
    const searchLower = query.toLowerCase()
    const title = course.title.toLowerCase()
    const tagline = course.metadata?.tagline?.toLowerCase() || ''
    const categories = course.metadata?.categories?.map(c => c.metadata?.name?.toLowerCase() || '').join(' ') || ''
    
    return title.includes(searchLower) || 
           tagline.includes(searchLower) || 
           categories.includes(searchLower)
  }).slice(0, 6)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCourses.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCourses[selectedIndex]) {
      window.location.href = `/courses/${filteredCourses[selectedIndex].slug}`
    }
  }, [isOpen, onClose, filteredCourses, selectedIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-navy-800">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, categories, topics..."
            className="flex-1 bg-transparent text-white placeholder-navy-500 text-lg outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-navy-400 bg-navy-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-navy-400">Start typing to search courses</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-xs text-navy-500">Try:</span>
                {['React', 'TypeScript', 'Node.js', 'AWS'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2 py-1 text-xs bg-navy-800 text-navy-300 rounded-full hover:bg-navy-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-navy-400">No courses found for &quot;{query}&quot;</p>
              <p className="text-navy-500 text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className={`flex items-center gap-4 px-4 py-3 hover:bg-navy-800/50 transition-colors ${
                    index === selectedIndex ? 'bg-navy-800/50' : ''
                  }`}
                  onClick={onClose}
                >
                  {course.metadata?.thumbnail ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=120&h=68&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-[60px] h-[34px] object-cover rounded"
                    />
                  ) : (
                    <div className="w-[60px] h-[34px] bg-navy-700 rounded flex items-center justify-center text-lg">
                      📚
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{course.title}</h4>
                    <p className="text-navy-400 text-sm truncate">{course.metadata?.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.metadata?.is_free && (
                      <span className="badge badge-free text-xs">Free</span>
                    )}
                    <svg className="w-4 h-4 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredCourses.length > 0 && (
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
            <span>{filteredCourses.length} results</span>
          </div>
        )}
      </div>
    </div>
  )
}