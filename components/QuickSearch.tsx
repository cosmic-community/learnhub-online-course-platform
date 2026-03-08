'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickSearchProps {
  courses: Course[]
  categories: Category[]
}

interface SearchResult {
  type: 'course' | 'category'
  id: string
  title: string
  slug: string
  description?: string
  icon?: string
  difficulty?: string
  isFree?: boolean
}

export default function QuickSearch({ courses, categories }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Transform data into searchable results
  const allResults: SearchResult[] = [
    ...courses.map(course => ({
      type: 'course' as const,
      id: course.id,
      title: course.metadata?.title || course.title,
      slug: course.slug,
      description: course.metadata?.tagline,
      difficulty: typeof course.metadata?.difficulty === 'object' 
        ? course.metadata.difficulty.value 
        : course.metadata?.difficulty,
      isFree: course.metadata?.is_free,
    })),
    ...categories.map(category => ({
      type: 'category' as const,
      id: category.id,
      title: category.metadata?.name || category.title,
      slug: category.slug,
      description: category.metadata?.description,
      icon: category.metadata?.icon,
    })),
  ]

  // Filter results based on query
  const filteredResults = query.trim() === '' 
    ? allResults.slice(0, 6) // Show recent/popular when no query
    : allResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Also handle click on search trigger button
      if (e.key === '/') {
        const activeElement = document.activeElement
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          setIsOpen(true)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    // Handle search trigger button clicks
    const searchTriggers = document.querySelectorAll('[data-search-trigger]')
    const handleClick = () => setIsOpen(true)
    searchTriggers.forEach(trigger => trigger.addEventListener('click', handleClick))

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      searchTriggers.forEach(trigger => trigger.removeEventListener('click', handleClick))
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle navigation within results
  const handleKeyNavigation = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredResults[selectedIndex]) {
          const result = filteredResults[selectedIndex]
          const href = result.type === 'course' 
            ? `/courses/${result.slug}`
            : `/categories/${result.slug}`
          window.location.href = href
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }, [filteredResults, selectedIndex])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-[20%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl animate-slide-up">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-navy-700">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses and categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNavigation}
              className="flex-1 bg-transparent text-white text-lg placeholder-navy-400 focus:outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-navy-400 bg-navy-800 rounded border border-navy-700">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-navy-400 px-3 py-2">
                  {query ? 'Results' : 'Quick Access'}
                </div>
                {filteredResults.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === 'course' ? `/courses/${result.slug}` : `/categories/${result.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${
                      index === selectedIndex 
                        ? 'bg-primary-500/20 text-white' 
                        : 'text-navy-200 hover:bg-navy-800'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      result.type === 'course' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'bg-navy-700 text-2xl'
                    }`}>
                      {result.type === 'course' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      ) : (
                        result.icon || '📂'
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{result.title}</span>
                        {result.type === 'course' && result.isFree && (
                          <span className="badge badge-free text-xs">Free</span>
                        )}
                        {result.type === 'course' && result.difficulty && (
                          <span className={`badge text-xs badge-${result.difficulty.toLowerCase()}`}>
                            {result.difficulty}
                          </span>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-sm text-navy-400 truncate">{result.description}</p>
                      )}
                    </div>

                    {/* Type Badge */}
                    <span className="text-xs text-navy-500 uppercase">
                      {result.type}
                    </span>

                    {/* Enter hint when selected */}
                    {index === selectedIndex && (
                      <kbd className="hidden sm:flex items-center px-2 py-0.5 text-xs text-navy-400 bg-navy-700 rounded">
                        ↵
                      </kbd>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-navy-400">No results found for &quot;{query}&quot;</p>
                <p className="text-navy-500 text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-700 text-xs text-navy-400">
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
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">esc</kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}