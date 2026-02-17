'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface SearchBarProps {
  courses: Course[]
}

export default function SearchBar({ courses }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCourses = query.length > 0
    ? courses.filter(course => {
        const searchLower = query.toLowerCase()
        const titleMatch = course.title.toLowerCase().includes(searchLower)
        const taglineMatch = course.metadata?.tagline?.toLowerCase().includes(searchLower)
        const categoryMatch = course.metadata?.categories?.some(
          cat => cat.metadata?.name?.toLowerCase().includes(searchLower)
        )
        return titleMatch || taglineMatch || categoryMatch
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
      e.preventDefault()
      window.location.href = `/courses/${filteredCourses[selectedIndex].slug}`
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
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
          placeholder="Search for courses, topics, or skills..."
          className="w-full pl-12 pr-4 py-4 bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-navy-400 hover:text-white transition-colors"
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
          className="absolute z-50 w-full mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden"
        >
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`flex items-center gap-4 p-4 transition-colors ${
                index === selectedIndex 
                  ? 'bg-primary-500/10 border-l-2 border-primary-500' 
                  : 'hover:bg-navy-800/50 border-l-2 border-transparent'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center text-2xl">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{course.title}</h4>
                <p className="text-navy-400 text-sm truncate">
                  {course.metadata?.tagline || 'No description'}
                </p>
              </div>
              <div className="flex-shrink-0">
                {course.metadata?.is_free ? (
                  <span className="badge badge-free text-xs">Free</span>
                ) : (
                  <span className="text-navy-300 text-sm">${course.metadata?.price || 0}</span>
                )}
              </div>
            </Link>
          ))}
          <div className="p-3 bg-navy-800/50 border-t border-navy-700 text-center">
            <Link 
              href={`/courses?search=${encodeURIComponent(query)}`}
              className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View all results for "{query}" →
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 0 && filteredCourses.length === 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-6 text-center"
        >
          <span className="text-4xl mb-2 block">🔍</span>
          <p className="text-navy-300">No courses found for "{query}"</p>
          <Link 
            href="/courses"
            className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block"
          >
            Browse all courses →
          </Link>
        </div>
      )}
    </div>
  )
}