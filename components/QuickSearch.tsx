'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Course, Category, Instructor } from '@/types'

interface QuickSearchProps {
  courses: Course[]
  categories: Category[]
  instructors: Instructor[]
}

interface SearchResult {
  type: 'course' | 'category' | 'instructor'
  id: string
  title: string
  subtitle?: string
  href: string
  icon: string
}

export default function QuickSearch({ courses, categories, instructors }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Build search results
  const results: SearchResult[] = (() => {
    if (!query.trim()) return []
    
    const q = query.toLowerCase()
    const searchResults: SearchResult[] = []
    
    // Search courses
    courses.forEach(course => {
      const title = course.metadata?.title || course.title
      const tagline = course.metadata?.tagline || ''
      if (title.toLowerCase().includes(q) || tagline.toLowerCase().includes(q)) {
        searchResults.push({
          type: 'course',
          id: course.id,
          title,
          subtitle: tagline,
          href: `/courses/${course.slug}`,
          icon: '📚',
        })
      }
    })
    
    // Search categories
    categories.forEach(category => {
      const name = category.metadata?.name || category.title
      if (name.toLowerCase().includes(q)) {
        searchResults.push({
          type: 'category',
          id: category.id,
          title: name,
          subtitle: category.metadata?.description,
          href: `/categories/${category.slug}`,
          icon: category.metadata?.icon || '🏷️',
        })
      }
    })
    
    // Search instructors
    instructors.forEach(instructor => {
      const name = instructor.metadata?.name || instructor.title
      if (name.toLowerCase().includes(q)) {
        searchResults.push({
          type: 'instructor',
          id: instructor.id,
          title: name,
          subtitle: instructor.metadata?.credentials,
          href: `/instructors/${instructor.slug}`,
          icon: '👨‍🏫',
        })
      }
    })
    
    return searchResults.slice(0, 8)
  })()

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      window.location.href = results[selectedIndex].href
      setIsOpen(false)
    }
  }, [results, selectedIndex])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 hover:text-navy-200 hover:border-navy-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm hidden sm:inline">Quick Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-navy-700 rounded text-xs">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-700">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>
          
          {/* Results */}
          <div ref={resultsRef} className="max-h-80 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-navy-400">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
            
            {results.length > 0 && (
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={`${result.type}-${result.id}`}>
                    <Link
                      href={result.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        index === selectedIndex 
                          ? 'bg-primary-500/20 text-white' 
                          : 'text-navy-200 hover:bg-navy-800'
                      }`}
                    >
                      <span className="text-xl">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-sm text-navy-400 truncate">{result.subtitle}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.type === 'course' ? 'bg-primary-500/20 text-primary-400' :
                        result.type === 'category' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {result.type}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            
            {!query && (
              <div className="px-4 py-6 text-center">
                <p className="text-navy-400 mb-2">Start typing to search...</p>
                <div className="flex items-center justify-center gap-4 text-xs text-navy-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">ESC</kbd> Close
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}