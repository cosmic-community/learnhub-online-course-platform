'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface SearchSuggestion {
  text: string
  href: string
  icon: string
}

const suggestions: SearchSuggestion[] = [
  { text: 'React Fundamentals', href: '/courses', icon: '⚛️' },
  { text: 'Node.js Backend', href: '/courses', icon: '🟢' },
  { text: 'TypeScript', href: '/courses', icon: '📘' },
  { text: 'AWS Cloud', href: '/courses', icon: '☁️' },
  { text: 'Vue.js', href: '/courses', icon: '💚' },
  { text: 'Web Development', href: '/categories/web-development', icon: '💻' },
]

export default function QuickSearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(s => 
        s.text.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(suggestions.slice(0, 4))
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary-400' : 'text-navy-500'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to learn today?"
          className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-navy-700 rounded-2xl text-white placeholder-navy-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
        />
        
        {isFocused && (
          <div className="absolute inset-x-0 top-full mt-2 bg-navy-800 border border-navy-700 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2">
              <p className="text-xs text-navy-500 px-3 py-2">
                {query ? 'Search results' : 'Popular searches'}
              </p>
              {filteredSuggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-700/50 transition-colors"
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="text-navy-200">{suggestion.text}</span>
                </Link>
              ))}
              {filteredSuggestions.length === 0 && (
                <p className="px-3 py-2 text-navy-400">No results found</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Keyboard shortcut hint */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
        <kbd className="px-2 py-1 text-xs text-navy-500 bg-navy-800 rounded border border-navy-700">
          ESC
        </kbd>
        <span className="text-navy-600 text-xs">to close</span>
      </div>
    </div>
  )
}