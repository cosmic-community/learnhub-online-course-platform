'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  type: 'course' | 'category'
  slug: string
  title: string
  description?: string
  icon?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search function (client-side for demo - in production, use API route)
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulated search - in production, call an API endpoint
    // For now, we'll fetch and filter client-side
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        // Fallback to empty results
        setResults([])
      }
    } catch {
      // If API doesn't exist yet, show demo results
      const demoResults: SearchResult[] = [
        { type: 'course', slug: 'vue-fundamentals', title: 'Vue.js Fundamentals', description: 'Build reactive web applications' },
        { type: 'course', slug: 'nodejs-backend-development', title: 'Node.js Backend Development', description: 'Build scalable server-side applications' },
        { type: 'course', slug: 'aws-fundamentals', title: 'AWS Fundamentals', description: 'Master cloud infrastructure' },
        { type: 'category', slug: 'web-development', title: 'Web Development', icon: '💻' },
        { type: 'category', slug: 'cloud-computing', title: 'Cloud Computing', icon: '☁️' },
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(demoResults)
    }
    
    setIsLoading(false)
    setSelectedIndex(0)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const result = results[selectedIndex]
      const href = result.type === 'course' ? `/courses/${result.slug}` : `/categories/${result.slug}`
      window.location.href = href
      onClose()
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = resultsRef.current?.children[selectedIndex] as HTMLElement
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-4 p-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs text-navy-500 bg-navy-800 rounded"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div 
            ref={resultsRef}
            className="max-h-[60vh] overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : query && results.length === 0 ? (
              <div className="p-8 text-center text-navy-400">
                <div className="text-4xl mb-2">🔍</div>
                <p>No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-sm mt-1">Try searching for something else</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <Link
                    key={`${result.type}-${result.slug}`}
                    href={result.type === 'course' ? `/courses/${result.slug}` : `/categories/${result.slug}`}
                    onClick={onClose}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-500/10 text-white'
                        : 'text-navy-300 hover:bg-navy-800'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      result.type === 'course' ? 'bg-primary-500/20' : 'bg-navy-700'
                    }`}>
                      {result.type === 'course' ? '📚' : result.icon || '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.description && (
                        <p className="text-sm text-navy-500 truncate">{result.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.type === 'course' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {result.type === 'course' ? 'Course' : 'Category'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <p className="text-sm text-navy-500 mb-4">Quick links</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/courses"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors"
                  >
                    <span className="text-xl">📚</span>
                    <span className="text-navy-300">All Courses</span>
                  </Link>
                  <Link
                    href="/categories"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors"
                  >
                    <span className="text-xl">🏷️</span>
                    <span className="text-navy-300">Categories</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors"
                  >
                    <span className="text-xl">✉️</span>
                    <span className="text-navy-300">Contact Us</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-navy-800 flex items-center justify-between text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd>
                <span className="ml-1">Select</span>
              </span>
            </div>
            <span>Powered by LearnHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}