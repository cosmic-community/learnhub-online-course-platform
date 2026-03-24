'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'course' | 'category' | 'page'
  title: string
  description?: string
  href: string
  icon: string
}

const staticPages: SearchResult[] = [
  { type: 'page', title: 'Home', description: 'Go to homepage', href: '/', icon: '🏠' },
  { type: 'page', title: 'All Courses', description: 'Browse all courses', href: '/courses', icon: '📚' },
  { type: 'page', title: 'Categories', description: 'Browse by category', href: '/categories', icon: '🏷️' },
  { type: 'page', title: 'Contact', description: 'Get in touch', href: '/contact', icon: '📧' },
]

export default function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Keyboard shortcut to open spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
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

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search logic
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(staticPages)
      return
    }

    setIsLoading(true)
    
    // Filter static pages
    const filteredPages = staticPages.filter(page =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Simulated course search (in real app, this would fetch from Cosmic)
    const courseResults: SearchResult[] = [
      { type: 'course', title: 'React Fundamentals', description: 'Learn React from scratch', href: '/courses/react-fundamentals', icon: '⚛️' },
      { type: 'course', title: 'Node.js Backend', description: 'Build server applications', href: '/courses/nodejs-backend-development', icon: '🟢' },
      { type: 'course', title: 'Vue.js Fundamentals', description: 'Master Vue.js', href: '/courses/vue-fundamentals', icon: '💚' },
      { type: 'course', title: 'AWS Fundamentals', description: 'Cloud computing basics', href: '/courses/aws-fundamentals', icon: '☁️' },
    ].filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const categoryResults: SearchResult[] = [
      { type: 'category', title: 'Web Development', description: 'Frontend & Backend', href: '/categories/web-development', icon: '💻' },
      { type: 'category', title: 'Cloud Computing', description: 'AWS, Azure, GCP', href: '/categories/cloud-computing', icon: '☁️' },
      { type: 'category', title: 'Mobile Development', description: 'iOS & Android', href: '/categories/mobile-development', icon: '📱' },
      { type: 'category', title: 'Data Science', description: 'ML & Analytics', href: '/categories/data-science', icon: '📊' },
    ].filter(category =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults([...filteredPages, ...courseResults, ...categoryResults])
    setSelectedIndex(0)
    setIsLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 150)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Initialize with static pages
  useEffect(() => {
    if (isOpen && !query) {
      setResults(staticPages)
    }
  }, [isOpen, query])

  // Handle navigation
  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    setIsOpen(false)
    setQuery('')
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 spotlight-overlay"
        onClick={() => {
          setIsOpen(false)
          setQuery('')
        }}
      />
      
      {/* Spotlight Modal */}
      <div className="relative max-w-2xl mx-auto mt-[15vh] px-4">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-bounce-in">
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-navy-700">
            <span className="text-navy-400 text-xl">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search courses, categories, or pages..."
              className="flex-1 px-4 py-4 bg-transparent text-white text-lg placeholder-navy-500 focus:outline-none"
            />
            <kbd className="px-2 py-1 bg-navy-800 border border-navy-600 rounded text-xs text-navy-400 font-mono">
              ESC
            </kbd>
          </div>
          
          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto spotlight-results">
            {isLoading ? (
              <div className="p-8 text-center text-navy-400">
                <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
                <p>Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-navy-400">
                <div className="text-4xl mb-2">🔎</div>
                <p>No results found for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.href}`}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary-500/20 text-white' 
                        : 'text-navy-200 hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-navy-400 truncate">{result.description}</div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      result.type === 'course' 
                        ? 'bg-primary-500/20 text-primary-400'
                        : result.type === 'category'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-navy-700 text-navy-300'
                    }`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer hint */}
          <div className="px-4 py-3 bg-navy-800/50 border-t border-navy-700 flex items-center justify-between text-xs text-navy-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-700 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-700 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-700 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span className="text-primary-400">Powered by LearnHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}