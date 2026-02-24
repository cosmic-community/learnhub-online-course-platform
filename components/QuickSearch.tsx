'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'course' | 'category' | 'instructor'
  title: string
  slug: string
  description?: string
  icon: string
}

interface QuickSearchProps {
  courses: { title: string; slug: string; metadata?: { tagline?: string } }[]
  categories: { title: string; slug: string; metadata?: { icon?: string; name?: string } }[]
  instructors: { title: string; slug: string; metadata?: { name?: string; credentials?: string } }[]
}

export default function QuickSearch({ courses, categories, instructors }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build search results
  const getResults = useCallback((): SearchResult[] => {
    if (!query.trim()) {
      // Show recent/popular when no query
      return [
        ...courses.slice(0, 3).map(c => ({
          type: 'course' as const,
          title: c.title,
          slug: c.slug,
          description: c.metadata?.tagline,
          icon: '📚'
        })),
        ...categories.slice(0, 2).map(c => ({
          type: 'category' as const,
          title: c.metadata?.name || c.title,
          slug: c.slug,
          icon: c.metadata?.icon || '🏷️'
        }))
      ]
    }

    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    // Search courses
    courses.forEach(c => {
      if (c.title.toLowerCase().includes(lowerQuery) || 
          c.metadata?.tagline?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'course',
          title: c.title,
          slug: c.slug,
          description: c.metadata?.tagline,
          icon: '📚'
        })
      }
    })

    // Search categories
    categories.forEach(c => {
      const name = c.metadata?.name || c.title
      if (name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'category',
          title: name,
          slug: c.slug,
          icon: c.metadata?.icon || '🏷️'
        })
      }
    })

    // Search instructors
    instructors.forEach(i => {
      const name = i.metadata?.name || i.title
      if (name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'instructor',
          title: name,
          slug: i.slug,
          description: i.metadata?.credentials,
          icon: '👨‍🏫'
        })
      }
    })

    return results.slice(0, 8)
  }, [query, courses, categories, instructors])

  const results = getResults()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      navigateToResult(results[selectedIndex])
    }
  }

  const navigateToResult = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    
    switch (result.type) {
      case 'course':
        router.push(`/courses/${result.slug}`)
        break
      case 'category':
        router.push(`/categories/${result.slug}`)
        break
      case 'instructor':
        router.push(`/instructors/${result.slug}`)
        break
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg text-navy-400 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Quick Search</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-navy-900 rounded text-xs text-navy-500">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false)
              setQuery('')
            }}
          />
          
          {/* Search Panel */}
          <div className="relative min-h-screen flex items-start justify-center pt-[15vh] px-4">
            <div className="relative w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center px-4 border-b border-navy-800">
                <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyNavigation}
                  placeholder="Search courses, categories, instructors..."
                  className="flex-1 px-4 py-4 bg-transparent text-white placeholder-navy-500 focus:outline-none"
                />
                <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-500">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-navy-500">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="space-y-1">
                    {!query && (
                      <div className="px-3 py-2 text-xs font-medium text-navy-500 uppercase tracking-wider">
                        Popular
                      </div>
                    )}
                    {results.map((result, index) => (
                      <button
                        key={`${result.type}-${result.slug}`}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                          index === selectedIndex 
                            ? 'bg-primary-500/20 text-white' 
                            : 'text-navy-300 hover:bg-navy-800'
                        }`}
                      >
                        <span className="text-2xl">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          {result.description && (
                            <div className="text-sm text-navy-500 truncate">
                              {result.description}
                            </div>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.type === 'course' ? 'bg-primary-500/20 text-primary-400' :
                          result.type === 'category' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
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
      )}
    </>
  )
}