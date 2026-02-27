'use client'

import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'

interface SearchResult {
  id: string
  title: string
  type: 'course' | 'category' | 'instructor'
  slug: string
  description?: string
  icon: string
}

interface SearchButtonProps {
  courses: SearchResult[]
  categories: SearchResult[]
  instructors: SearchResult[]
}

export default function SearchButton({ courses, categories, instructors }: SearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-navy-400 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg transition-all hover:border-navy-600 group"
      >
        <svg 
          className="w-4 h-4 group-hover:text-navy-300" 
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
        <span className="hidden lg:inline">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-navy-700/50 rounded ml-2">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courses={courses}
        categories={categories}
        instructors={instructors}
      />
    </>
  )
}