'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface SearchBarProps {
  courses: Course[]
}

export default function SearchBar({ courses }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Course[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = courses.filter((course) => {
        const searchText = `${course.title} ${course.metadata?.tagline || ''} ${course.metadata?.description || ''}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
      setResults(filtered.slice(0, 5))
      setIsOpen(true)
    } else {
      setResults([])
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

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-48 lg:w-64 px-4 py-2 pl-10 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400"
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
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 bg-navy-900 border border-navy-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              onClick={() => {
                setIsOpen(false)
                setQuery('')
              }}
              className="flex items-center gap-3 p-3 hover:bg-navy-800 transition-colors"
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=80&h=45&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-9 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-9 rounded bg-navy-700 flex items-center justify-center text-lg">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{course.title}</p>
                <p className="text-navy-400 text-xs truncate">{course.metadata?.tagline}</p>
              </div>
            </Link>
          ))}
          <Link
            href={`/courses?search=${encodeURIComponent(query)}`}
            onClick={() => {
              setIsOpen(false)
              setQuery('')
            }}
            className="block p-3 text-center text-primary-400 text-sm hover:bg-navy-800 border-t border-navy-700"
          >
            View all results →
          </Link>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-80 bg-navy-900 border border-navy-700 rounded-lg shadow-xl z-50 p-4 text-center">
          <p className="text-navy-400 text-sm">No courses found for "{query}"</p>
        </div>
      )}
    </div>
  )
}