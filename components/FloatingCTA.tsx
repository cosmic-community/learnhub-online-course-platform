'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 500px
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div
        className={`
          transition-all duration-300 ease-out
          ${isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}
      >
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2 w-64 bg-navy-900 border border-navy-700 rounded-2xl shadow-xl p-4 animate-fadeIn">
            <div className="text-white font-semibold mb-2">Quick Actions</div>
            <div className="space-y-2">
              <Link
                href="/courses"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-300 hover:text-white"
              >
                <span>📚</span>
                <span className="text-sm">Browse Courses</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-300 hover:text-white"
              >
                <span>🏷️</span>
                <span className="text-sm">Explore Categories</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-300 hover:text-white"
              >
                <span>💬</span>
                <span className="text-sm">Get in Touch</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative w-14 h-14 rounded-full shadow-lg transition-all duration-300
          flex items-center justify-center
          ${isExpanded 
            ? 'bg-navy-800 border border-navy-600' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:scale-110'
          }
        `}
        aria-label="Quick actions menu"
      >
        <span className={`text-2xl transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>
          {isExpanded ? '✕' : '🚀'}
        </span>
        
        {/* Pulse animation when not expanded */}
        {!isExpanded && (
          <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25" />
        )}
      </button>
    </div>
  )
}