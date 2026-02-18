'use client'

import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'
import type { Course } from '@/types'

interface SearchButtonProps {
  courses: Course[]
}

export default function SearchButton({ courses }: SearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Global keyboard shortcut
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
        className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 rounded-lg text-navy-400 hover:text-white transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden lg:inline text-sm">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-navy-700 rounded">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>
      
      <SearchModal 
        courses={courses} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}