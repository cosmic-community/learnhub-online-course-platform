'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  type: 'course' | 'category' | 'page'
  title: string
  subtitle?: string
  href: string
  icon: string
}

const staticPages: SearchResult[] = [
  { type: 'page', title: 'All Courses', subtitle: 'Browse our complete course catalog', href: '/courses', icon: '📚' },
  { type: 'page', title: 'Categories', subtitle: 'Find courses by topic', href: '/categories', icon: '🏷️' },
  { type: 'page', title: 'Contact Us', subtitle: 'Get in touch with our team', href: '/contact', icon: '📬' },
]

interface SearchModalProps {
  courses: Array<{
    slug: string
    title: string
    metadata?: {
      tagline?: string
    }
  }>
  categories: Array<{
    slug: string
    title: string
    metadata?: {
      name?: string
      icon?: string
    }
  }>
}

export default function SearchModal({ courses, categories }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Build search results
  const allResults: SearchResult[] = [
    ...staticPages,
    ...courses.map(course => ({
      type: 'course' as const,
      title: course.title,
      subtitle: course.metadata?.tagline,
      href: `/courses/${course.slug}`,
      icon: '📖',
    })),
    ...categories.map(cat => ({
      type: 'category' as const,
      title: cat.metadata?.name || cat.title,
      subtitle: 'Category',
      href: `/categories/${cat.slug}`,
      icon: cat.metadata?.icon || '📂',
    })),
  ]

  const filteredResults = query
    ? allResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allResults.slice(0, 6) // Show featured results when no query

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

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Navigate with keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        window.location.href = filteredResults[selectedIndex].href
        setIsOpen(false)
      }
    },
    [filteredResults, selectedIndex]
  )

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 hover:text-white hover:border-navy-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-900 rounded text-xs text-navy-500">
          ⌘K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm animate-fadeIn"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
        <div
          ref={modalRef}
          className="w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search courses, categories..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredResults.length > 0 ? (
              <div className="space-y-1">
                {!query && (
                  <div className="px-3 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Quick Links
                  </div>
                )}
                {filteredResults.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.href}`}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-500/20 text-white'
                        : 'text-navy-300 hover:bg-navy-800'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="text-xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-navy-500 truncate">{result.subtitle}</div>
                      )}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-navy-800 rounded text-navy-400 capitalize">
                      {result.type}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-navy-500">
                <div className="text-4xl mb-2">🔍</div>
                <div>No results found for "{query}"</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd> Select
              </span>
            </div>
            <span>Powered by LearnHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}