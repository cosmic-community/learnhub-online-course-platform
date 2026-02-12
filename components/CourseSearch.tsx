'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSearchProps {
  courses: Course[]
}

export default function CourseSearch({ courses }: CourseSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredCourses = query.length > 0
    ? courses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.metadata?.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        course.metadata?.categories?.some(cat => 
          cat.metadata?.name?.toLowerCase().includes(query.toLowerCase())
        )
      ).slice(0, 5)
    : []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCourses.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCourses[selectedIndex]) {
      window.location.href = `/courses/${filteredCourses[selectedIndex].slug}`
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search courses, topics, or instructors..."
          className="w-full px-5 py-4 pl-12 bg-navy-900/80 border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && filteredCourses.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                index === selectedIndex 
                  ? 'bg-primary-500/20 text-white' 
                  : 'hover:bg-navy-800 text-navy-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                  alt=""
                  className="w-16 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded bg-navy-700 flex items-center justify-center text-xl">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{course.title}</div>
                <div className="text-sm text-navy-400 truncate">
                  {course.metadata?.tagline}
                </div>
              </div>
              {course.metadata?.is_free && (
                <span className="badge badge-free text-xs">Free</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length > 0 && filteredCourses.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-6 text-center z-50">
          <div className="text-4xl mb-2">🔍</div>
          <div className="text-navy-300">No courses found for "{query}"</div>
          <Link 
            href="/courses" 
            className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block"
            onClick={() => setIsOpen(false)}
          >
            Browse all courses →
          </Link>
        </div>
      )}
    </div>
  )
}