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
  courses: SearchItem[]
  categories: SearchItem[]
  instructors: SearchItem[]
}

export default function QuickSearch({ courses, categories, instructors }: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const allItems: SearchItem[] = [
    ...courses.map(c => ({ ...c, type: 'course' as const, icon: '📚' })),
    ...categories.map(c => ({ ...c, type: 'category' as const, icon: '🏷️' })),
    ...instructors.map(i => ({ ...i, type: 'instructor' as const, icon: '👨‍🏫' })),
  ]

  const filteredItems = query.length > 0 
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : allItems.slice(0, 6)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Open with Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
    // Close with Escape
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      navigateToItem(filteredItems[selectedIndex])
    }
  }

  const navigateToItem = (item: SearchItem) => {
    setIsOpen(false)
    switch (item.type) {
      case 'course':
        router.push(`/courses/${item.slug}`)
        break
      case 'category':
        router.push(`/categories/${item.slug}`)
        break
      case 'instructor':
        router.push(`/instructors/${item.slug}`)
        break
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'Course'
      case 'category': return 'Category'
      case 'instructor': return 'Instructor'
      default: return type
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 text-sm hover:bg-navy-800 hover:border-navy-600 transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-navy-900 rounded text-xs text-navy-500 group-hover:text-navy-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-[20%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-50">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
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
              onKeyDown={handleItemKeyDown}
              placeholder="Search courses, categories, instructors..."
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-base"
            />
            <kbd className="px-2 py-1 bg-navy-800 rounded text-xs text-navy-500">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="py-2">
                {filteredItems.map((item, index) => (
                  <button
                    key={`${item.type}-${item.slug}`}
                    onClick={() => navigateToItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex ? 'bg-navy-800' : 'hover:bg-navy-800/50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{item.title}</div>
                      {item.description && (
                        <div className="text-navy-400 text-sm truncate">{item.description}</div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.type === 'course' ? 'bg-primary-500/20 text-primary-400' :
                      item.type === 'category' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-navy-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-navy-800/50 border-t border-navy-800 text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-900 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-900 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-900 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-900 rounded">esc</kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </>
  )
}