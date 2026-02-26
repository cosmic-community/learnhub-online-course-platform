'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function QuickStartButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    // Check if user has dismissed this before
    const dismissed = sessionStorage.getItem('quickstart-dismissed')
    if (dismissed) return

    // Show button after a delay and scroll
    const handleScroll = () => {
      if (window.scrollY > 300 && !hasScrolled) {
        setHasScrolled(true)
        setTimeout(() => setIsVisible(true), 500)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('quickstart-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {/* Expanded menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-navy-900 border border-navy-700 rounded-2xl shadow-xl p-4 w-64 animate-fade-in-up">
          <div className="text-sm font-semibold text-white mb-3">Quick Start 🚀</div>
          <div className="space-y-2">
            <Link 
              href="/courses" 
              className="block p-3 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <div className="text-sm font-medium text-white">Browse All Courses</div>
                  <div className="text-xs text-navy-400">Find your perfect course</div>
                </div>
              </div>
            </Link>
            <Link 
              href="/categories" 
              className="block p-3 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏷️</span>
                <div>
                  <div className="text-sm font-medium text-white">Explore Categories</div>
                  <div className="text-xs text-navy-400">Web, Mobile, Cloud & more</div>
                </div>
              </div>
            </Link>
            <Link 
              href="/contact" 
              className="block p-3 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <div className="text-sm font-medium text-white">Get Help</div>
                  <div className="text-xs text-navy-400">We're here to assist</div>
                </div>
              </div>
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="mt-3 w-full text-xs text-navy-500 hover:text-navy-400 transition-colors"
          >
            Don't show again
          </button>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 
          text-white shadow-lg shadow-primary-500/30 
          flex items-center justify-center
          hover:scale-110 hover:shadow-primary-500/50
          transition-all duration-300
          ${isExpanded ? 'rotate-45' : ''}
        `}
        aria-label="Quick start menu"
      >
        <span className="text-2xl">{isExpanded ? '×' : '✨'}</span>
      </button>

      {/* Pulse animation ring */}
      {!isExpanded && (
        <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping pointer-events-none" />
      )}
    </div>
  )
}