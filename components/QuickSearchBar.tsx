'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickSearchBarProps {
  courses: Course[]
  categories: Category[]
}

export default function QuickSearchBar({ courses, categories }: QuickSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learnhub-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('learnhub-recent-searches', JSON.stringify(updated))
  }

  const filteredCourses = query.trim()
    ? courses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.metadata?.tagline?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  const filteredCategories = query.trim()
    ? categories.filter(cat =>
        cat.title.toLowerCase().includes(query.toLowerCase()) ||
        cat.metadata?.name?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : []

  const hasResults = filteredCourses.length > 0 || filteredCategories.length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search courses, categories... (⌘K)"
          className="w-full pl-12 pr-4 py-4 bg-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-2xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-navy-400 bg-navy-700/50 rounded border border-navy-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (query.trim() || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="text-xs text-navy-500 uppercase tracking-wider mb-3">Recent Searches</div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      saveSearch(search)
                    }}
                    className="px-3 py-1.5 bg-navy-800 text-navy-300 rounded-lg text-sm hover:bg-navy-700 hover:text-white transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim() && (
            <>
              {hasResults ? (
                <div className="divide-y divide-navy-800">
                  {/* Courses */}
                  {filteredCourses.length > 0 && (
                    <div className="p-4">
                      <div className="text-xs text-navy-500 uppercase tracking-wider mb-3">Courses</div>
                      <div className="space-y-2">
                        {filteredCourses.map(course => (
                          <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            onClick={() => {
                              saveSearch(query)
                              setIsOpen(false)
                              setQuery('')
                            }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-navy-800 transition-colors group"
                          >
                            {course.metadata?.thumbnail ? (
                              <img
                                src={`${course.metadata.thumbnail.imgix_url}?w=96&h=54&fit=crop&auto=format,compress`}
                                alt={course.title}
                                className="w-16 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-10 rounded-lg bg-navy-700 flex items-center justify-center text-xl">
                                📚
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                                {course.title}
                              </div>
                              {course.metadata?.tagline && (
                                <div className="text-navy-400 text-sm truncate">
                                  {course.metadata.tagline}
                                </div>
                              )}
                            </div>
                            <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {filteredCategories.length > 0 && (
                    <div className="p-4">
                      <div className="text-xs text-navy-500 uppercase tracking-wider mb-3">Categories</div>
                      <div className="flex flex-wrap gap-2">
                        {filteredCategories.map(category => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            onClick={() => {
                              saveSearch(query)
                              setIsOpen(false)
                              setQuery('')
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-xl hover:bg-navy-700 transition-colors"
                          >
                            <span className="text-xl">{category.metadata?.icon || '📁'}</span>
                            <span className="text-white">{category.metadata?.name || category.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="text-navy-400">No results found for &quot;{query}&quot;</div>
                  <div className="text-navy-500 text-sm mt-1">Try different keywords</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}