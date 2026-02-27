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

interface GlobalSearchProps {
  courses: SearchResult[]
  categories: SearchResult[]
  instructors: SearchResult[]
}

export default function GlobalSearch({ courses, categories, instructors }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle keyboard shortcut globally
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
    <SearchModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      courses={courses}
      categories={categories}
      instructors={instructors}
    />
  )
}