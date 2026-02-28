'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-navy-900/80 backdrop-blur-md border-b border-navy-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-navy-200 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/categories" className="text-navy-200 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/achievements" className="text-navy-200 hover:text-white transition-colors flex items-center gap-1">
              <span>🏆</span>
              <span>Achievements</span>
            </Link>
            <Link href="/contact" className="text-navy-200 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-navy-200 hover:text-white p-2"
            aria-label="Toggle menu"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-4">
              <Link 
                href="/courses" 
                className="text-navy-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="text-navy-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/achievements" 
                className="text-navy-200 hover:text-white transition-colors py-2 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🏆</span>
                <span>Achievements</span>
              </Link>
              <Link 
                href="/contact" 
                className="text-navy-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}