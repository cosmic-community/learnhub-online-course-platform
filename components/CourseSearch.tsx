'use client'

import { useState, useRef, useEffect } from 'react'
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
  const resultsRef = useRef<HTMLDivElement>(null)

  const filteredCourses = query.length > 0
    ? courses.filter(course => {
        const title = course.metadata?.title?.toLowerCase() ?? course.title.toLowerCase()
        const tagline = course.metadata?.tagline?.toLowerCase() ?? ''
        const searchQuery = query.toLowerCase()
        return title.includes(searchQuery) || tagline.includes(searchQuery)
      }).slice(0, 5)
    : []

  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCourses.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const getDifficultyBadge = (difficulty: string | { value?: string } | undefined) => {
    const level = typeof difficulty === 'object' ? difficulty?.value : difficulty
    const colors: Record<string, string> = {
      beginner: 'bg-green-500/20 text-green-400',
      intermediate: 'bg-yellow-500/20 text-yellow-400',
      advanced: 'bg-red-500/20 text-red-400'
    }
    return colors[level?.toLowerCase() ?? ''] ?? 'bg-navy-700 text-navy-300'
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && filteredCourses.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in"
        >
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`flex items-center gap-4 p-4 transition-colors ${
                index === selectedIndex ? 'bg-navy-700' : 'hover:bg-navy-700/50'
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {course.metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                  alt=""
                  className="w-16 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-navy-600 flex items-center justify-center text-xl">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {course.metadata?.title ?? course.title}
                </div>
                <div className="text-sm text-navy-400 truncate">
                  {course.metadata?.tagline}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyBadge(course.metadata?.difficulty)}`}>
                {typeof course.metadata?.difficulty === 'object' 
                  ? course.metadata.difficulty?.value 
                  : course.metadata?.difficulty}
              </span>
            </Link>
          ))}
          
          <div className="p-3 border-t border-navy-700 bg-navy-800/50">
            <Link 
              href="/courses" 
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center justify-center gap-2"
            >
              View all {courses.length} courses
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 0 && filteredCourses.length === 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl p-8 text-center z-50 animate-fade-in"
        >
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-navy-300 mb-2">No courses found for "{query}"</p>
          <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm">
            Browse all courses →
          </Link>
        </div>
      )}
    </div>
  )
}