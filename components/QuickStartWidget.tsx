'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickStartWidgetProps {
  hasVisited?: boolean
}

export default function QuickStartWidget({ hasVisited = false }: QuickStartWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Delay showing the widget for a nice entrance
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    // Check if user has visited before
    if (typeof window !== 'undefined') {
      const visited = localStorage.getItem('hasVisitedLearnHub')
      if (!visited) {
        setShowWelcome(true)
        localStorage.setItem('hasVisitedLearnHub', 'true')
      }
    }

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Welcome Modal for First-Time Visitors */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 animate-bounce-slow">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Welcome to LearnHub!</h2>
              <p className="text-navy-300 mb-6">
                We're thrilled to have you here. Ready to start your learning journey with expert-led courses?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/courses" 
                  className="btn-primary flex-1"
                  onClick={() => setShowWelcome(false)}
                >
                  Explore Courses
                </Link>
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="btn-secondary flex-1"
                >
                  Browse Around
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Start Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <div className={`transition-all duration-500 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 mb-4 w-72 shadow-2xl">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>⚡</span> Quick Start
            </h3>
            <div className="space-y-2">
              <Link 
                href="/courses" 
                className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">📚</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">Browse Courses</div>
                  <div className="text-navy-500 text-xs">Find your next skill</div>
                </div>
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">🏷️</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">Categories</div>
                  <div className="text-navy-500 text-xs">Explore by topic</div>
                </div>
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">💬</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">Get Help</div>
                  <div className="text-navy-500 text-xs">We're here for you</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
          aria-label="Quick Start Menu"
        >
          <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-20" />
          <svg 
            className="w-6 h-6 relative z-10 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            )}
          </svg>
        </button>
      </div>
    </>
  )
}