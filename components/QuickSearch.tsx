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
  title: string
  subtitle: string
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
  const getSearchResults = useCallback((): SearchResult[] => {
    if (!query.trim()) {
      // Show recent/suggested items when no query
      return [
        ...courses.slice(0, 3).map(c => ({
          type: 'course' as const,
          title: c.metadata?.title || c.title,
          subtitle: c.metadata?.tagline || 'Course',
          href: `/courses/${c.slug}`,
          icon: '📚'
        })),
        ...categories.slice(0, 2).map(c => ({
          type: 'category' as const,
          title: c.metadata?.name || c.title,
          subtitle: 'Category',
          href: `/categories/${c.slug}`,
          icon: c.metadata?.icon || '🏷️'
        }))
      ]
    }

    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    // Search courses
    courses.forEach(course => {
      const title = course.metadata?.title || course.title
      const tagline = course.metadata?.tagline || ''
      if (title.toLowerCase().includes(lowerQuery) || tagline.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'course',
          title,
          subtitle: tagline || 'Course',
          href: `/courses/${course.slug}`,
          icon: '📚'
        })
      }
    })

    // Search categories
    categories.forEach(category => {
      const name = category.metadata?.name || category.title
      if (name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'category',
          title: name,
          subtitle: category.metadata?.description?.slice(0, 50) || 'Category',
          href: `/categories/${category.slug}`,
          icon: category.metadata?.icon || '🏷️'
        })
      }
    })

    // Search instructors
    instructors.forEach(instructor => {
      const name = instructor.metadata?.name || instructor.title
      if (name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'instructor',
          title: name,
          subtitle: instructor.metadata?.credentials || 'Instructor',
          href: `/instructors/${instructor.slug}`,
          icon: '👨‍🏫'
        })
      }
    })

    return results.slice(0, 8)
  }, [query, courses, categories, instructors])

  const results = getSearchResults()

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard navigation in results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        window.location.href = results[selectedIndex].href
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 hover:text-white hover:border-navy-600 transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm">Quick Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-navy-700 rounded group-hover:bg-navy-600 transition-colors">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
        <div className="relative w-full max-w-xl bg-navy-900 rounded-2xl shadow-2xl border border-navy-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 py-4 bg-transparent text-white placeholder-navy-500 focus:outline-none"
            />
            <kbd className="px-2 py-1 text-xs bg-navy-800 text-navy-400 rounded">ESC</kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-80 overflow-y-auto py-2">
            {results.length === 0 && query && (
              <div className="px-4 py-8 text-center text-navy-400">
                <div className="text-4xl mb-2">🔍</div>
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            )}
            
            {results.length > 0 && (
              <>
                {!query && (
                  <div className="px-4 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Suggested
                  </div>
                )}
                {results.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.href}`}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary-500/10 border-l-2 border-primary-500' 
                        : 'hover:bg-navy-800/50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{result.title}</div>
                      <div className="text-navy-400 text-sm truncate">{result.subtitle}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.type === 'course' ? 'bg-primary-500/20 text-primary-400' :
                      result.type === 'category' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {result.type}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span>Powered by LearnHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}