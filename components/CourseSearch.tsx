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
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCourses = query.length > 0
    ? courses.filter(course => {
        const title = course.metadata?.title || course.title
        const tagline = course.metadata?.tagline || ''
        const searchText = `${title} ${tagline}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      }).slice(0, 5)
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredCourses.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selectedCourse = filteredCourses[selectedIndex]
      if (selectedCourse) {
        window.location.href = `/courses/${selectedCourse.slug}`
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const getDifficultyColor = (difficulty: string | { value?: string } | undefined) => {
    const value = typeof difficulty === 'object' ? difficulty?.value : difficulty
    switch (value?.toLowerCase()) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-navy-400'
    }
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for courses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length > 0)
            setSelectedIndex(-1)
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-5 py-4 pl-12 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
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

      {/* Search Results Dropdown */}
      {isOpen && filteredCourses.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-xl overflow-hidden z-50"
        >
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`block px-4 py-3 hover:bg-navy-700 transition-colors ${
                index === selectedIndex ? 'bg-navy-700' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                {course.metadata?.thumbnail?.imgix_url && (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                    alt=""
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {course.metadata?.title || course.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={getDifficultyColor(course.metadata?.difficulty)}>
                      {typeof course.metadata?.difficulty === 'object' 
                        ? course.metadata?.difficulty?.value 
                        : course.metadata?.difficulty}
                    </span>
                    {course.metadata?.estimated_hours && (
                      <>
                        <span className="text-navy-500">•</span>
                        <span className="text-navy-400">{course.metadata.estimated_hours}h</span>
                      </>
                    )}
                    {course.metadata?.is_free && (
                      <>
                        <span className="text-navy-500">•</span>
                        <span className="text-primary-400 font-medium">Free</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/courses"
            className="block px-4 py-3 text-center text-primary-400 hover:bg-navy-700 transition-colors border-t border-navy-700"
          >
            View all courses →
          </Link>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 0 && filteredCourses.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-xl p-4 text-center z-50"
        >
          <p className="text-navy-400">No courses found for &ldquo;{query}&rdquo;</p>
          <Link href="/courses" className="text-primary-400 hover:underline text-sm mt-1 inline-block">
            Browse all courses
          </Link>
        </div>
      )}
    </div>
  )
}