'use client'

import Link from 'next/link'
import { useState } from 'react'
import LearningStreak from './LearningStreak'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-200">📚</span>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-navy-300 hover:text-white transition-colors relative group">
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-200" />
            </Link>
            <Link href="/categories" className="text-navy-300 hover:text-white transition-colors relative group">
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-200" />
            </Link>
            <Link href="/contact" className="text-navy-300 hover:text-white transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-200" />
            </Link>
          </nav>

          {/* Right side - Streak + CTA */}
          <div className="flex items-center gap-4">
            <LearningStreak />
            
            <Link href="/courses" className="hidden sm:inline-flex btn-primary text-sm">
              Start Learning
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-navy-300 hover:text-white transition-colors"
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800 animate-slide-down">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/courses" 
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/contact" 
                className="text-navy-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/courses" 
                className="btn-primary text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
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