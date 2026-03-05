'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface HeroSearchProps {
  courses: Course[]
}

export default function HeroSearch({ courses }: HeroSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const filteredCourses = query.length > 0
    ? courses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.metadata?.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        course.metadata?.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
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
    } else if (e.key === 'Enter' && selectedIndex >= 0 && filteredCourses[selectedIndex]) {
      window.location.href = `/courses/${filteredCourses[selectedIndex].slug}`
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for courses..."
          className="w-full px-6 py-4 pl-14 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-2xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
        />
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500"
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
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-navy-500 hover:text-white transition-colors"
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
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl overflow-hidden shadow-xl z-50"
        >
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`block px-5 py-4 hover:bg-navy-700/50 transition-colors ${
                index === selectedIndex ? 'bg-navy-700/50' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-4">
                {course.metadata?.thumbnail?.imgix_url ? (
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
                  <p className="text-navy-400 text-sm truncate">
                    {course.metadata?.tagline || 'No description'}
                  </p>
                </div>
                <div className="text-primary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length > 0 && filteredCourses.length === 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-navy-800 border border-navy-700 rounded-xl overflow-hidden shadow-xl z-50 p-6 text-center"
        >
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-navy-300">No courses found for &quot;{query}&quot;</p>
          <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block">
            Browse all courses →
          </Link>
        </div>
      )}
    </div>
  )
}