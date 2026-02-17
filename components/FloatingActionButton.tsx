'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2 animate-fadeIn">
          <Link
            href="/courses"
            className="flex items-center gap-3 bg-navy-800 hover:bg-navy-700 text-white px-4 py-3 rounded-xl shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl">📚</span>
            <span className="text-sm font-medium">Browse Courses</span>
          </Link>
          <Link
            href="/categories"
            className="flex items-center gap-3 bg-navy-800 hover:bg-navy-700 text-white px-4 py-3 rounded-xl shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl">🏷️</span>
            <span className="text-sm font-medium">Categories</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 bg-navy-800 hover:bg-navy-700 text-white px-4 py-3 rounded-xl shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl">💬</span>
            <span className="text-sm font-medium">Get Help</span>
          </Link>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all duration-300 hover:shadow-primary-500/50 hover:scale-110 ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label="Quick actions menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  )
}