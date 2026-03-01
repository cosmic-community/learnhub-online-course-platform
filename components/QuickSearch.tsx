'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'course' | 'category' | 'action'
  title: string
  subtitle?: string
  href: string
  icon: string
}

const quickActions: SearchResult[] = [
  { type: 'action', title: 'Browse All Courses', href: '/courses', icon: '📚' },
  { type: 'action', title: 'View Categories', href: '/categories', icon: '🏷️' },
  { type: 'action', title: 'Contact Us', href: '/contact', icon: '✉️' },
]

interface QuickSearchProps {
  courses: Array<{
    slug: string
    title: string
    metadata?: {
      tagline?: string
      difficulty?: { value?: string }
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

export default function QuickSearch({ courses, categories }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build search results
  const getResults = useCallback((): SearchResult[] => {
    const q = query.toLowerCase().trim()
    
    if (!q) {
      return [
        ...quickActions,
        ...courses.slice(0, 3).map(c => ({
          type: 'course' as const,
          title: c.title,
          subtitle: c.metadata?.tagline ?? c.metadata?.difficulty?.value ?? '',
          href: `/courses/${c.slug}`,
          icon: '📖'
        })),
        ...categories.slice(0, 3).map(c => ({
          type: 'category' as const,
          title: c.metadata?.name ?? c.title,
          subtitle: 'Category',
          href: `/categories/${c.slug}`,
          icon: c.metadata?.icon ?? '📂'
        }))
      ]
    }

    const results: SearchResult[] = []
    
    // Search courses
    courses.forEach(c => {
      const title = c.title.toLowerCase()
      const tagline = c.metadata?.tagline?.toLowerCase() ?? ''
      if (title.includes(q) || tagline.includes(q)) {
        results.push({
          type: 'course',
          title: c.title,
          subtitle: c.metadata?.tagline ?? '',
          href: `/courses/${c.slug}`,
          icon: '📖'
        })
      }
    })

    // Search categories
    categories.forEach(c => {
      const name = (c.metadata?.name ?? c.title).toLowerCase()
      if (name.includes(q)) {
        results.push({
          type: 'category',
          title: c.metadata?.name ?? c.title,
          subtitle: 'Category',
          href: `/categories/${c.slug}`,
          icon: c.metadata?.icon ?? '📂'
        })
      }
    })

    // Add matching quick actions
    quickActions.forEach(action => {
      if (action.title.toLowerCase().includes(q)) {
        results.push(action)
      }
    })

    return results.slice(0, 10)
  }, [query, courses, categories])

  const results = getResults()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // / to open (when not in input)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Escape to close
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
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      router.push(results[selectedIndex].href)
      setIsOpen(false)
    }
  }

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 rounded-lg text-navy-400 text-sm transition-colors border border-navy-700"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick Search</span>
        <kbd className="px-1.5 py-0.5 bg-navy-900 rounded text-xs text-navy-500">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-xl bg-navy-900 rounded-2xl shadow-2xl border border-navy-700 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNavigation}
              placeholder="Search courses, categories, or type a command..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-500">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="text-center py-8 text-navy-400">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.href}`}
                    onClick={() => {
                      router.push(result.href)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors
                      ${index === selectedIndex 
                        ? 'bg-primary-500/20 text-white' 
                        : 'text-navy-200 hover:bg-navy-800'
                      }
                    `}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-navy-400 truncate">{result.subtitle}</div>
                      )}
                    </div>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full flex-shrink-0
                      ${result.type === 'course' ? 'bg-primary-500/20 text-primary-400' : ''}
                      ${result.type === 'category' ? 'bg-green-500/20 text-green-400' : ''}
                      ${result.type === 'action' ? 'bg-navy-700 text-navy-300' : ''}
                    `}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-800 text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span><kbd className="px-1 bg-navy-800 rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 bg-navy-800 rounded">↵</kbd> Select</span>
              <span><kbd className="px-1 bg-navy-800 rounded">ESC</kbd> Close</span>
            </div>
            <div>Press <kbd className="px-1 bg-navy-800 rounded">/</kbd> anytime to search</div>
          </div>
        </div>
      </div>
    </div>
  )
}