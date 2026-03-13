'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Shortcut {
  key: string
  description: string
  action: () => void
}

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const shortcuts: Shortcut[] = [
    { key: 'h', description: 'Go to Home', action: () => router.push('/') },
    { key: 'c', description: 'Browse Courses', action: () => router.push('/courses') },
    { key: 't', description: 'View Categories', action: () => router.push('/categories') },
    { key: 'o', description: 'Contact Us', action: () => router.push('/contact') },
    { key: '?', description: 'Show this help', action: () => setShowHelp(true) },
    { key: 'Escape', description: 'Close dialog', action: () => { setShowHelp(false); setShowSearch(false) } },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (e.key === 'Escape') {
        setShowSearch(false)
        setShowHelp(false)
      }
      return
    }

    // Cmd/Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setShowSearch(true)
      return
    }

    // Regular shortcuts (without modifiers)
    if (e.metaKey || e.ctrlKey || e.altKey) return

    const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase())
    if (shortcut) {
      e.preventDefault()
      shortcut.action()
    }
  }, [router, shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Search Modal */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
          onClick={() => setShowSearch(false)}
        >
          <div 
            className="w-full max-w-lg mx-4 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-4 bg-navy-900 border border-navy-700 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500 text-sm">
                <kbd className="px-2 py-1 bg-navy-800 rounded text-xs">ESC</kbd> to close
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="w-full max-w-md mx-4 bg-navy-900 border border-navy-700 rounded-2xl p-6 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-navy-800">
                <span className="text-navy-300">Quick Search</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-navy-800 rounded text-sm text-navy-300">⌘</kbd>
                  <kbd className="px-2 py-1 bg-navy-800 rounded text-sm text-navy-300">K</kbd>
                </div>
              </div>
              
              {shortcuts.filter(s => s.key !== 'Escape').map((shortcut) => (
                <div 
                  key={shortcut.key}
                  className="flex items-center justify-between py-2 border-b border-navy-800 last:border-0"
                >
                  <span className="text-navy-300">{shortcut.description}</span>
                  <kbd className="px-3 py-1 bg-navy-800 rounded text-sm text-navy-300 min-w-[2rem] text-center">
                    {shortcut.key === '?' ? '?' : shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-navy-500 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-navy-800 rounded">?</kbd> anywhere to show this help
            </p>
          </div>
        </div>
      )}

      {/* Floating hint */}
      <div className="fixed bottom-5 left-5 z-40 hidden lg:block">
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 px-3 py-2 bg-navy-900/90 backdrop-blur border border-navy-700 rounded-lg text-sm text-navy-400 hover:text-white hover:border-navy-600 transition-all"
        >
          <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-xs">?</kbd>
          <span>Shortcuts</span>
        </button>
      </div>
    </>
  )
}