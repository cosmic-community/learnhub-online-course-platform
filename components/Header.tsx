'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import LearningStreak from './LearningStreak'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-navy-950/80 backdrop-blur-md border-b border-navy-800 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-navy-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/categories" className="text-navy-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/contact" className="text-navy-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && <LearningStreak compact />}
            <Link href="/courses" className="btn-primary">
              Start Learning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-navy-300 hover:text-white"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-4">
              {mounted && (
                <div className="flex justify-center pb-4">
                  <LearningStreak compact />
                </div>
              )}
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
              <Link href="/courses" className="btn-primary text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                Start Learning
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}