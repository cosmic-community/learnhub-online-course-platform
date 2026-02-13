'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickSearchProps {
  courses: Course[]
}

export default function QuickSearch({ courses }: QuickSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const filteredCourses = query.length >= 2 
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
  }, [filteredCourses.length])
  
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
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for courses... (e.g., React, AWS, Vue)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length >= 2)
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-5 py-4 pl-12 bg-navy-800/50 border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {query.length > 0 && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {isOpen && filteredCourses.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-xl overflow-hidden z-50">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`flex items-center gap-4 p-4 transition-colors ${
                index === selectedIndex 
                  ? 'bg-primary-500/20' 
                  : 'hover:bg-navy-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=80&h=60&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-12 bg-navy-700 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{course.title}</h4>
                <div className="flex items-center gap-2 text-sm text-navy-400">
                  {course.metadata?.categories?.[0] && (
                    <span>{course.metadata.categories[0].metadata?.icon} {course.metadata.categories[0].metadata?.name}</span>
                  )}
                  {course.metadata?.difficulty && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700">
                      {course.metadata.difficulty.value}
                    </span>
                  )}
                </div>
              </div>
              <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          
          <Link
            href={`/courses?search=${encodeURIComponent(query)}`}
            className="flex items-center justify-center gap-2 p-3 bg-navy-800/50 text-primary-400 hover:text-primary-300 text-sm transition-colors"
          >
            <span>View all results for "{query}"</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
      
      {/* No Results */}
      {isOpen && query.length >= 2 && filteredCourses.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-xl p-6 text-center z-50">
          <span className="text-4xl mb-2 block">🔍</span>
          <p className="text-navy-300">No courses found for "{query}"</p>
          <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block">
            Browse all courses →
          </Link>
        </div>
      )}
    </div>
  )
}