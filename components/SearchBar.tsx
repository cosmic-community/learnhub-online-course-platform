'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface SearchBarProps {
  courses: Course[]
  categories: Category[]
}

interface SearchResult {
  type: 'course' | 'category'
  id: string
  title: string
  slug: string
  subtitle?: string
  icon?: string
}

export default function SearchBar({ courses, categories }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    
    const courseResults: SearchResult[] = courses
      .filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.metadata?.tagline?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 4)
      .map(course => ({
        type: 'course',
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.metadata?.tagline,
        icon: '📚'
      }))

    const categoryResults: SearchResult[] = categories
      .filter(category => 
        category.title.toLowerCase().includes(searchTerm) ||
        category.metadata?.name?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 2)
      .map(category => ({
        type: 'category',
        id: category.id,
        title: category.metadata?.name || category.title,
        slug: category.slug,
        icon: category.metadata?.icon || '🏷️'
      }))

    setResults([...courseResults, ...categoryResults])
    setSelectedIndex(-1)
  }, [query, courses, categories])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      const result = results[selectedIndex]
      if (result) {
        window.location.href = result.type === 'course' 
          ? `/courses/${result.slug}` 
          : `/categories/${result.slug}`
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
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
          placeholder="Search courses, categories..."
          className="w-full pl-12 pr-4 py-4 bg-navy-900/50 border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2">
            {results.map((result, index) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.type === 'course' ? `/courses/${result.slug}` : `/categories/${result.slug}`}
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  index === selectedIndex 
                    ? 'bg-primary-500/20 text-white' 
                    : 'hover:bg-navy-800 text-navy-200'
                }`}
              >
                <span className="text-xl">{result.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{result.title}</div>
                  {result.subtitle && (
                    <div className="text-sm text-navy-400 truncate">{result.subtitle}</div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.type === 'course' 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'bg-navy-700 text-navy-300'
                }`}>
                  {result.type}
                </span>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2 bg-navy-800/50 text-xs text-navy-400 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-navy-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-navy-300">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-navy-300">↵</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-navy-300">esc</kbd>
              to close
            </span>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-6 text-center z-50">
          <span className="text-4xl mb-3 block">🔍</span>
          <p className="text-navy-300">No results found for "{query}"</p>
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