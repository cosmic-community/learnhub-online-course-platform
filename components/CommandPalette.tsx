'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchItem {
  id: string
  title: string
  type: 'course' | 'category' | 'instructor' | 'page'
  slug: string
  icon: string
  description?: string
}

interface CommandPaletteProps {
  courses: Array<{ id: string; slug: string; title: string; metadata?: { tagline?: string } }>
  categories: Array<{ id: string; slug: string; title: string; metadata?: { name?: string; icon?: string } }>
  instructors: Array<{ id: string; slug: string; title: string; metadata?: { name?: string; credentials?: string } }>
}

export default function CommandPalette({ courses, categories, instructors }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build searchable items
  const items: SearchItem[] = [
    // Pages
    { id: 'home', title: 'Home', type: 'page', slug: '/', icon: '🏠', description: 'Go to homepage' },
    { id: 'courses', title: 'All Courses', type: 'page', slug: '/courses', icon: '📚', description: 'Browse all courses' },
    { id: 'categories', title: 'Categories', type: 'page', slug: '/categories', icon: '🏷️', description: 'Browse categories' },
    { id: 'contact', title: 'Contact', type: 'page', slug: '/contact', icon: '✉️', description: 'Get in touch' },
    // Courses
    ...courses.map(course => ({
      id: course.id,
      title: course.title,
      type: 'course' as const,
      slug: `/courses/${course.slug}`,
      icon: '📖',
      description: course.metadata?.tagline || 'Course'
    })),
    // Categories
    ...categories.map(cat => ({
      id: cat.id,
      title: cat.metadata?.name || cat.title,
      type: 'category' as const,
      slug: `/categories/${cat.slug}`,
      icon: cat.metadata?.icon || '📂',
      description: 'Category'
    })),
    // Instructors
    ...instructors.map(inst => ({
      id: inst.id,
      title: inst.metadata?.name || inst.title,
      type: 'instructor' as const,
      slug: `/instructors/${inst.slug}`,
      icon: '👨‍🏫',
      description: inst.metadata?.credentials || 'Instructor'
    }))
  ]

  // Filter items based on query
  const filteredItems = query
    ? items.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      )
    : items.slice(0, 8)

  // Group filtered items by type
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, SearchItem[]>)

  const flatItems = filteredItems

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle navigation within the palette
  const handleKeyNavigation = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % flatItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length)
    } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
      e.preventDefault()
      navigateTo(flatItems[selectedIndex].slug)
    }
  }, [flatItems, selectedIndex])

  const navigateTo = (slug: string) => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
    router.push(slug)
  }

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-navy-400 bg-navy-800/50 border border-navy-700 rounded-lg hover:bg-navy-800 hover:text-navy-200 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Quick Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-navy-700 rounded">
          ⌘K
        </kbd>
      </button>
    )
  }

  const typeLabels: Record<string, string> = {
    page: 'Pages',
    course: 'Courses',
    category: 'Categories',
    instructor: 'Instructors'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div
          className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden"
          style={{
            animation: 'commandPaletteIn 0.2s ease-out'
          }}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-navy-800">
            <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, categories, instructors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNavigation}
              className="flex-1 bg-transparent text-white placeholder-navy-500 outline-none text-lg"
            />
            <kbd className="px-2 py-1 text-xs font-mono text-navy-400 bg-navy-800 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {flatItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-navy-400">No results found for "{query}"</p>
                <p className="text-navy-500 text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([type, typeItems]) => (
                <div key={type} className="mb-4 last:mb-0">
                  <div className="px-3 py-2 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                    {typeLabels[type] || type}
                  </div>
                  {typeItems.map((item) => {
                    const globalIndex = flatItems.findIndex(i => i.id === item.id)
                    const isSelected = globalIndex === selectedIndex

                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.slug)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-primary-500/20 text-white'
                            : 'text-navy-200 hover:bg-navy-800/50'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-navy-400 truncate">{item.description}</div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-xs text-navy-400">
                            <span>Open</span>
                            <kbd className="px-1.5 py-0.5 bg-navy-700 rounded">↵</kbd>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-800 text-xs text-navy-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">↵</kbd>
                <span>Open</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">ESC</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes commandPaletteIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  )
}