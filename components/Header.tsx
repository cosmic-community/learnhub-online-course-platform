'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchModal from './SearchModal'
import type { Course, Category, Instructor } from '@/types'

interface HeaderProps {
  courses?: Course[]
  categories?: Category[]
  instructors?: Instructor[]
}

export default function Header({ courses = [], categories = [], instructors = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transform transition-transform duration-300 group-hover:rotate-12">📚</span>
            <span className="text-xl font-bold text-white">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-navy-300 hover:text-white transition-colors relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/categories"
              className="text-navy-300 hover:text-white transition-colors relative group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/contact"
              className="text-navy-300 hover:text-white transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Search + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <SearchModal 
              courses={courses} 
              categories={categories} 
              instructors={instructors} 
            />
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
          <div className="md:hidden py-4 border-t border-navy-800 animate-slideDown">
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