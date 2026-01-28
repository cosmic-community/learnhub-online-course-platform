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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 1) {
      const filtered = courses.filter(course => {
        const title = course.title?.toLowerCase() || ''
        const tagline = course.metadata?.tagline?.toLowerCase() || ''
        const searchQuery = query.toLowerCase()
        
        return title.includes(searchQuery) || tagline.includes(searchQuery)
      }).slice(0, 5)
      
      setFilteredCourses(filtered)
      setIsOpen(true)
    } else {
      setFilteredCourses([])
      setIsOpen(false)
    }
  }, [query, courses])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for courses..."
          className="w-full px-5 py-4 pl-12 bg-navy-900/70 backdrop-blur-sm border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
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
            onClick={() => setQuery('')}
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              onClick={handleSelect}
              className="flex items-center gap-4 p-4 hover:bg-navy-800/50 transition-colors border-b border-navy-800 last:border-0"
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{course.title}</h4>
                <p className="text-navy-400 text-sm truncate">
                  {course.metadata?.tagline || 'No description'}
                </p>
              </div>
              <div className="text-right">
                {course.metadata?.is_free ? (
                  <span className="text-primary-400 font-medium">Free</span>
                ) : (
                  <span className="text-white font-medium">${course.metadata?.price || 0}</span>
                )}
              </div>
            </Link>
          ))}
          <Link
            href="/courses"
            onClick={handleSelect}
            className="block p-3 text-center text-primary-400 hover:bg-navy-800/50 transition-colors text-sm font-medium"
          >
            View all courses →
          </Link>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 1 && filteredCourses.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-6 text-center z-50 animate-fadeIn">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-navy-300">No courses found for &quot;{query}&quot;</p>
          <Link
            href="/courses"
            onClick={handleSelect}
            className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block"
          >
            Browse all courses
          </Link>
        </div>
      )}
    </div>
  )
}