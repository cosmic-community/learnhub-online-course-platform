'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  type: 'course' | 'category' | 'instructor'
  slug: string
  description?: string
  icon: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  courses: SearchResult[]
  categories: SearchResult[]
  instructors: SearchResult[]
}

export default function SearchModal({ 
  isOpen, 
  onClose, 
  courses, 
  categories, 
  instructors 
}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Filter results based on query
  const filteredResults = useCallback(() => {
    if (!query.trim()) {
      // Show recent/popular items when no query
      return [
        ...courses.slice(0, 3),
        ...categories.slice(0, 2),
        ...instructors.slice(0, 2)
      ]
    }

    const lowerQuery = query.toLowerCase()
    const filtered: SearchResult[] = []

    courses.forEach(course => {
      if (course.title.toLowerCase().includes(lowerQuery) || 
          course.description?.toLowerCase().includes(lowerQuery)) {
        filtered.push(course)
      }
    })

    categories.forEach(category => {
      if (category.title.toLowerCase().includes(lowerQuery)) {
        filtered.push(category)
      }
    })

    instructors.forEach(instructor => {
      if (instructor.title.toLowerCase().includes(lowerQuery)) {
        filtered.push(instructor)
      }
    })

    return filtered.slice(0, 8)
  }, [query, courses, categories, instructors])

  const results = filteredResults()

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      const result = results[selectedIndex]
      if (result) {
        const href = getResultHref(result)
        window.location.href = href
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [results, selectedIndex, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex, results.length])

  const getResultHref = (result: SearchResult): string => {
    switch (result.type) {
      case 'course':
        return `/courses/${result.slug}`
      case 'category':
        return `/categories/${result.slug}`
      case 'instructor':
        return `/instructors/${result.slug}`
      default:
        return '/'
    }
  }

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'course':
        return 'Course'
      case 'category':
        return 'Category'
      case 'instructor':
        return 'Instructor'
      default:
        return ''
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-navy-800">
          <svg 
            className="w-5 h-5 text-navy-400" 
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
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, categories, instructors..."
            className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-navy-500 bg-navy-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-navy-400">
              <span className="text-4xl mb-3 block">🔍</span>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-4 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                  Quick Access
                </div>
              )}
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={getResultHref(result)}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    index === selectedIndex 
                      ? 'bg-primary-500/20 text-white' 
                      : 'text-navy-200 hover:bg-navy-800'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="text-2xl flex-shrink-0">{result.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-navy-400 truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.type === 'course' 
                      ? 'bg-primary-500/20 text-primary-400'
                      : result.type === 'category'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {getTypeLabel(result.type)}
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
  )
}