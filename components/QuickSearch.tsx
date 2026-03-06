'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  subtitle: string
  href: string
  icon: string
}

export default function QuickSearch({ courses, categories, instructors }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Generate search results
  const results: SearchResult[] = query.trim() === '' ? [] : [
    ...courses
      .filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.metadata?.tagline?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(c => ({
        type: 'course' as const,
        id: c.id,
        title: c.metadata?.title || c.title,
        subtitle: c.metadata?.tagline || 'Course',
        href: `/courses/${c.slug}`,
        icon: '📚'
      })),
    ...categories
      .filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.metadata?.name?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(c => ({
        type: 'category' as const,
        id: c.id,
        title: c.metadata?.name || c.title,
        subtitle: 'Category',
        href: `/categories/${c.slug}`,
        icon: c.metadata?.icon || '🏷️'
      })),
    ...instructors
      .filter(i => 
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.metadata?.name?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(i => ({
        type: 'instructor' as const,
        id: i.id,
        title: i.metadata?.name || i.title,
        subtitle: i.metadata?.credentials || 'Instructor',
        href: `/instructors/${i.slug}`,
        icon: '👨‍🏫'
      }))
  ]

  // Quick actions when no query
  const quickActions: SearchResult[] = [
    { type: 'course', id: 'all-courses', title: 'Browse All Courses', subtitle: 'View our complete catalog', href: '/courses', icon: '📚' },
    { type: 'category', id: 'all-categories', title: 'Explore Categories', subtitle: 'Find courses by topic', href: '/categories', icon: '🏷️' },
    { type: 'course', id: 'contact', title: 'Contact Us', subtitle: 'Get in touch with our team', href: '/contact', icon: '✉️' },
  ]

  const displayResults = query.trim() === '' ? quickActions : results

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    
    if (!isOpen) return

    if (e.key === 'Escape') {
      setIsOpen(false)
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, displayResults.length - 1))
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }
    
    if (e.key === 'Enter' && displayResults[selectedIndex]) {
      e.preventDefault()
      router.push(displayResults[selectedIndex].href)
      setIsOpen(false)
      setQuery('')
    }
  }, [isOpen, displayResults, selectedIndex, router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          setIsOpen(false)
          setQuery('')
        }}
      />
      
      {/* Modal */}
      <div className="relative flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden animate-slide-up">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 text-lg focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-navy-800 rounded text-navy-400 text-xs">
              ESC
            </kbd>
          </div>
          
          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {displayResults.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-navy-400">No results found for &quot;{query}&quot;</p>
                <p className="text-navy-500 text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {query.trim() === '' && (
                  <div className="px-4 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Quick Actions
                  </div>
                )}
                {query.trim() !== '' && (
                  <div className="px-4 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                )}
                {displayResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => {
                      router.push(result.href)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary-500/10 text-white' 
                        : 'text-navy-200 hover:bg-navy-800/50'
                    }`}
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      <div className="text-sm text-navy-400 truncate">{result.subtitle}</div>
                    </div>
                    {index === selectedIndex && (
                      <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-navy-800 rounded text-navy-400 text-xs">
                        Enter
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-800 text-xs text-navy-500">
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