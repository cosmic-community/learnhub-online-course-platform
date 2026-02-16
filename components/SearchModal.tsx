'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  type: 'course' | 'category' | 'lesson'
  slug: string
  description?: string
  icon?: string
}

interface SearchModalProps {
  courses: { id: string; slug: string; title: string; metadata?: { tagline?: string } }[]
  categories: { id: string; slug: string; title: string; metadata?: { icon?: string; name?: string } }[]
}

export default function SearchModal({ courses, categories }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Build searchable items
  const searchItems: SearchResult[] = [
    ...courses.map((c) => ({
      id: c.id,
      title: c.title,
      type: 'course' as const,
      slug: `/courses/${c.slug}`,
      description: c.metadata?.tagline,
      icon: '📚',
    })),
    ...categories.map((c) => ({
      id: c.id,
      title: c.metadata?.name || c.title,
      type: 'category' as const,
      slug: `/categories/${c.slug}`,
      icon: c.metadata?.icon || '🏷️',
    })),
  ]

  // Search function
  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults(searchItems.slice(0, 6))
      return
    }

    const lowerQuery = q.toLowerCase()
    const filtered = searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    )
    setResults(filtered.slice(0, 8))
    setSelectedIndex(0)
  }, [searchItems])

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

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      search('')
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen, search])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      setIsOpen(false)
      window.location.href = results[selectedIndex].slug
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg text-navy-400 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-700 rounded text-xs text-navy-400">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 text-navy-400 hover:text-white"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" />
          
          <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
            <div
              ref={modalRef}
              className="relative w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 border-b border-navy-700">
                <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    search(e.target.value)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search courses, categories..."
                  className="flex-1 py-4 bg-transparent text-white placeholder-navy-500 outline-none"
                />
                <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <ul>
                    {results.map((result, index) => (
                      <li key={result.id}>
                        <Link
                          href={result.slug}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            index === selectedIndex
                              ? 'bg-primary-500/10 text-white'
                              : 'text-navy-300 hover:bg-navy-800'
                          }`}
                        >
                          <span className="text-xl">{result.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{result.title}</div>
                            {result.description && (
                              <div className="text-sm text-navy-500 truncate">{result.description}</div>
                            )}
                          </div>
                          <span className="text-xs text-navy-500 capitalize">{result.type}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-navy-500">
                    <span className="text-3xl block mb-2">🔍</span>
                    No results found for "{query}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-navy-700 flex items-center justify-between text-xs text-navy-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-navy-800 rounded">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-navy-800 rounded">↵</kbd> select
                  </span>
                </div>
                <span>Powered by LearnHub</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}