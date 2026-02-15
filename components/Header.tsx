'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchModal from './SearchModal'
import type { Course } from '@/types'

interface HeaderProps {
  courses?: Course[]
}

export default function Header({ courses = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-950/95 backdrop-blur-lg border-b border-navy-800 shadow-lg shadow-navy-950/50' 
          : 'bg-navy-950/80 backdrop-blur-lg border-b border-navy-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
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

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-navy-400 hover:text-white bg-navy-800/50 hover:bg-navy-800 rounded-lg transition-colors group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm">Search</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs text-navy-500 bg-navy-900 rounded">
                  ⌘K
                </kbd>
              </button>
              
              <Link href="/courses" className="btn-primary">
                Start Learning
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-navy-300 hover:text-white"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-navy-300 hover:text-white"
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
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-navy-800 animate-in slide-in-from-top-2 duration-200">
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

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        courses={courses}
      />
    </>
  )
}