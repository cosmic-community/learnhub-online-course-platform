'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-2xl">📚</span>
            <span>LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-navy-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/categories" className="text-navy-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/contact" className="text-navy-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link 
              href="/quiz" 
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-400 hover:bg-primary-500/20 hover:border-primary-500/50 transition-all"
            >
              <span>🎯</span>
              <span>Find Your Path</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-navy-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-4">
              <Link 
                href="/courses" 
                className="text-navy-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="text-navy-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/contact" 
                className="text-navy-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/quiz" 
                className="flex items-center gap-2 text-primary-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🎯</span>
                <span>Find Your Path Quiz</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}