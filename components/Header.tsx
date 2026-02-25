'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import CommandPalette from './CommandPalette'

interface HeaderProps {
  courses?: Array<{ id: string; slug: string; title: string; metadata?: { tagline?: string } }>
  categories?: Array<{ id: string; slug: string; title: string; metadata?: { name?: string; icon?: string } }>
  instructors?: Array<{ id: string; slug: string; title: string; metadata?: { name?: string; credentials?: string } }>
}

export default function Header({ courses = [], categories = [], instructors = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-navy-950/95 backdrop-blur-lg border-b border-navy-800/50 shadow-lg shadow-navy-950/50' 
        : 'bg-navy-950/80 backdrop-blur-sm'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/courses" 
              className="px-4 py-2 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
            >
              Courses
            </Link>
            <Link 
              href="/categories" 
              className="px-4 py-2 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
            >
              Categories
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
            >
              Contact
            </Link>
          </div>

          {/* Command Palette & Mobile Menu */}
          <div className="flex items-center gap-3">
            <CommandPalette 
              courses={courses}
              categories={categories}
              instructors={instructors}
            />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-1">
              <Link 
                href="/courses" 
                className="px-4 py-3 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="px-4 py-3 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-3 text-navy-200 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}