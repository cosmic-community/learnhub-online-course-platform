'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchItem {
  type: 'course' | 'category' | 'instructor'
  title: string
  slug: string
  description?: string
  icon: string
}

interface QuickSearchProps {
  courses: { title: string; slug: string; metadata?: { tagline?: string } }[]
  categories: { title: string; slug: string; metadata?: { name?: string; icon?: string } }[]
  instructors: { title: string; slug: string; metadata?: { name?: string; credentials?: string } }[]
}

export default function QuickSearch({ courses, categories, instructors }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build search items
  const allItems: SearchItem[] = [
    ...courses.map(c => ({
      type: 'course' as const,
      title: c.title,
      slug: c.slug,
      description: c.metadata?.tagline,
      icon: '📚'
    })),
    ...categories.map(c => ({
      type: 'category' as const,
      title: c.metadata?.name || c.title,
      slug: c.slug,
      icon: c.metadata?.icon || '🏷️'
    })),
    ...instructors.map(i => ({
      type: 'instructor' as const,
      title: i.metadata?.name || i.title,
      slug: i.slug,
      description: i.metadata?.credentials,
      icon: '👨‍🏫'
    }))
  ]

  // Filter items based on query
  const filteredItems = query.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8) // Show top 8 when no query

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
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

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Handle navigation
  const handleSelect = useCallback((item: SearchItem) => {
    setIsOpen(false)
    const basePath = item.type === 'course' ? '/courses' 
      : item.type === 'category' ? '/categories'
      : '/instructors'
    router.push(`${basePath}/${item.slug}`)
  }, [router])

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      handleSelect(filteredItems[selectedIndex])
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-lg text-sm text-navy-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick Search</span>
        <kbd className="px-1.5 py-0.5 bg-navy-900 rounded text-xs">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
        <div className="bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-navy-500">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={`${item.type}-${item.slug}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedIndex === index
                        ? 'bg-primary-500/20 text-white'
                        : 'text-navy-300 hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-navy-500 truncate">{item.description}</div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.type === 'course' ? 'bg-primary-500/20 text-primary-400' :
                      item.type === 'category' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-navy-800 flex items-center gap-4 text-xs text-navy-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-navy-800 rounded">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-navy-800 rounded">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-navy-800 rounded">ESC</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}