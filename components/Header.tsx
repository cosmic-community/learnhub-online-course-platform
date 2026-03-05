'use client'

import { useState } from 'react'
import Link from 'next/link'
import StreakTracker from './StreakTracker'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
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

          {/* Right side - Streak Tracker & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <StreakTracker />
            <Link href="/courses" className="btn-primary text-sm">
              Start Learning
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <StreakTracker />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-navy-300 hover:text-white transition-colors"
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
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-4">
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
                className="btn-primary text-sm text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Learning
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}