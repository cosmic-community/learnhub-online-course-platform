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
    const handleClickOutside = (event: MouseEvent) => {
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

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for courses, topics, or skills..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-4 py-4 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-navy-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredCourses.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-2">
            <p className="text-xs text-navy-400 px-3 py-2">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
            {filteredCourses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  index === selectedIndex ? 'bg-navy-700' : 'hover:bg-navy-700/50'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {course.metadata?.thumbnail ? (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                    alt=""
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-navy-600 flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{course.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-navy-400">
                    {course.metadata?.difficulty && (
                      <span className="capitalize">{course.metadata.difficulty.value}</span>
                    )}
                    {course.metadata?.is_free && (
                      <span className="text-primary-400">• Free</span>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          <div className="border-t border-navy-700 p-2">
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 p-3 text-primary-400 hover:bg-navy-700/50 rounded-lg transition-colors"
            >
              View all courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && filteredCourses.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-8 text-center">
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-navy-300 mb-2">No courses found for &quot;{query}&quot;</p>
            <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm">
              Browse all courses →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}