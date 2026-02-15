'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Course, Category, Instructor } from '@/types'

interface SearchResult {
  id: string
  type: 'course' | 'category' | 'instructor'
  title: string
  subtitle: string
  icon: string
  href: string
}

interface CommandPaletteProps {
  courses: Course[]
  categories: Category[]
  instructors: Instructor[]
}

export default function CommandPalette({ courses, categories, instructors }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build search results
  const results: SearchResult[] = (() => {
    if (!query.trim()) {
      // Show recent/popular when empty
      return [
        ...courses.slice(0, 3).map((c) => ({
          id: c.id,
          type: 'course' as const,
          title: c.title,
          subtitle: c.metadata?.tagline || 'Course',
          icon: '📚',
          href: `/courses/${c.slug}`,
        })),
        ...categories.slice(0, 2).map((c) => ({
          id: c.id,
          type: 'category' as const,
          title: c.metadata?.name || c.title,
          subtitle: 'Category',
          icon: c.metadata?.icon || '🏷️',
          href: `/categories/${c.slug}`,
        })),
      ]
    }

    const lowerQuery = query.toLowerCase()
    const matchedCourses = courses
      .filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.metadata?.tagline?.toLowerCase().includes(lowerQuery) ||
          c.metadata?.description?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        type: 'course' as const,
        title: c.title,
        subtitle: c.metadata?.tagline || 'Course',
        icon: '📚',
        href: `/courses/${c.slug}`,
      }))

    const matchedCategories = categories
      .filter(
        (c) =>
          (c.metadata?.name || c.title).toLowerCase().includes(lowerQuery) ||
          c.metadata?.description?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: 'category' as const,
        title: c.metadata?.name || c.title,
        subtitle: 'Category',
        icon: c.metadata?.icon || '🏷️',
        href: `/categories/${c.slug}`,
      }))

    const matchedInstructors = instructors
      .filter(
        (i) =>
          (i.metadata?.name || i.title).toLowerCase().includes(lowerQuery) ||
          i.metadata?.credentials?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        type: 'instructor' as const,
        title: i.metadata?.name || i.title,
        subtitle: i.metadata?.credentials || 'Instructor',
        icon: '👨‍🏫',
        href: `/instructors/${i.slug}`,
      }))

    return [...matchedCourses, ...matchedCategories, ...matchedInstructors]
  })()

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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        router.push(results[selectedIndex].href)
        setIsOpen(false)
        setQuery('')
      }
    },
    [results, selectedIndex, router]
  )

  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    setIsOpen(false)
    setQuery('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg text-navy-400 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-700 rounded text-xs text-navy-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="min-h-full flex items-start justify-center p-4 pt-[15vh]">
        <div className="relative w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 animate-slide-up overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="flex-1 py-4 bg-transparent text-white placeholder-navy-500 outline-none"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-navy-400">
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="space-y-1">
                {!query && (
                  <p className="px-3 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Quick Access
                  </p>
                )}
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-500/20 text-white'
                        : 'text-navy-300 hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      <p className="text-sm text-navy-400 truncate">{result.subtitle}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        result.type === 'course'
                          ? 'bg-primary-500/20 text-primary-400'
                          : result.type === 'category'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-navy-800 flex items-center gap-4 text-xs text-navy-500">
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
        </div>
      </div>
    </div>
  )
}