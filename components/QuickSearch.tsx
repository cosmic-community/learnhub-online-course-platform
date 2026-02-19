'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface SearchResult {
  type: 'course' | 'category' | 'instructor'
  title: string
  slug: string
  subtitle?: string
  icon?: string
}

// This would typically come from an API, but for demo purposes we'll use static data
const SEARCH_DATA: SearchResult[] = [
  { type: 'course', title: 'Node.js Backend Development', slug: 'nodejs-backend-development', subtitle: 'Build scalable server-side applications' },
  { type: 'course', title: 'AWS Fundamentals', slug: 'aws-fundamentals', subtitle: 'Master cloud infrastructure' },
  { type: 'course', title: 'Vue.js Fundamentals', slug: 'vue-fundamentals', subtitle: 'Build reactive web applications' },
  { type: 'category', title: 'Web Development', slug: 'web-development', icon: '💻' },
  { type: 'category', title: 'Cloud Computing', slug: 'cloud-computing', icon: '☁️' },
  { type: 'category', title: 'Mobile Development', slug: 'mobile-development', icon: '📱' },
  { type: 'category', title: 'Data Science', slug: 'data-science', icon: '📊' },
]

export default function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const filtered = SEARCH_DATA.filter(
        item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const result = results[selectedIndex]
      const path = result.type === 'course' 
        ? `/courses/${result.slug}`
        : result.type === 'category'
        ? `/categories/${result.slug}`
        : `/instructors/${result.slug}`
      window.location.href = path
    }
  }

  const getResultPath = (result: SearchResult) => {
    switch (result.type) {
      case 'course': return `/courses/${result.slug}`
      case 'category': return `/categories/${result.slug}`
      case 'instructor': return `/instructors/${result.slug}`
      default: return '/'
    }
  }

  const getResultIcon = (result: SearchResult) => {
    if (result.icon) return result.icon
    switch (result.type) {
      case 'course': return '📚'
      case 'category': return '🏷️'
      case 'instructor': return '👨‍🏫'
      default: return '📄'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 hover:text-white hover:border-navy-600 transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-navy-700 rounded text-xs">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-800">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Search courses, categories..."
            className="flex-1 bg-transparent text-white placeholder-navy-400 outline-none text-lg"
          />
          <button
            onClick={() => {
              setIsOpen(false)
              setQuery('')
            }}
            className="px-2 py-1 bg-navy-800 rounded text-navy-400 text-xs hover:text-white"
          >
            ESC
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((result, index) => (
              <Link
                key={`${result.type}-${result.slug}`}
                href={getResultPath(result)}
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary-500/20 text-white'
                    : 'text-navy-300 hover:bg-navy-800'
                }`}
              >
                <span className="text-xl">{getResultIcon(result)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{result.title}</div>
                  {result.subtitle && (
                    <div className="text-sm text-navy-400 truncate">{result.subtitle}</div>
                  )}
                </div>
                <span className="text-xs text-navy-500 capitalize">{result.type}</span>
              </Link>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-12 text-center text-navy-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>No results found for "{query}"</p>
          </div>
        ) : (
          <div className="py-8 px-4 text-center text-navy-400">
            <p className="text-sm">Start typing to search courses and categories</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
          <div className="flex gap-4">
            <span><kbd className="px-1 bg-navy-800 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 bg-navy-800 rounded">↵</kbd> Open</span>
          </div>
          <span><kbd className="px-1 bg-navy-800 rounded">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}