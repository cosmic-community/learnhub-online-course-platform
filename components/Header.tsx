'use client'

import Link from 'next/link'
import { useState } from 'react'
import LearningStreak from './LearningStreak'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-800 bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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

          {/* Right side - Streak + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LearningStreak />
            <Link href="/courses" className="btn-primary">
              Start Learning
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <LearningStreak />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-navy-300 hover:text-white p-2"
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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800">
            <nav className="flex flex-col gap-4">
              <Link
                href="/courses"
                className="text-navy-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/categories"
                className="text-navy-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/contact"
                className="text-navy-300 hover:text-white transition-colors"
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