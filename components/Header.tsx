'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/courses" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Courses
            </Link>
            <Link 
              href="/categories" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/contact" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Search hint + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => {
                // Trigger the Cmd+K search
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  bubbles: true
                })
                document.dispatchEvent(event)
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-400 hover:text-navy-200 hover:border-navy-600 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 bg-navy-900 rounded text-xs">⌘K</kbd>
            </button>
            <Link href="/courses" className="btn-primary text-sm py-2">
              Start Learning
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-navy-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/courses" 
                className="text-navy-300 hover:text-white transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="text-navy-300 hover:text-white transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/contact" 
                className="text-navy-300 hover:text-white transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/courses" 
                className="btn-primary text-center"
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