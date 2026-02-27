'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  type: 'course' | 'category' | 'instructor'
  slug: string
  description?: string
  icon: string
}

interface HeaderProps {
  searchData?: {
    courses: SearchResult[]
    categories: SearchResult[]
    instructors: SearchResult[]
  }
}

export default function Header({ searchData }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/categories"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/contact"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Button with Keyboard Shortcut Hint */}
            <button
              onClick={() => {
                // Dispatch keyboard event to open search modal
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  bubbles: true
                })
                document.dispatchEvent(event)
              }}
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
            <Link href="/courses" className="btn-primary">
              Start Learning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-navy-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800">
            <nav className="flex flex-col gap-4">
              <Link
                href="/courses"
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/categories"
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/contact"
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/courses"
                className="btn-primary text-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Learning
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}