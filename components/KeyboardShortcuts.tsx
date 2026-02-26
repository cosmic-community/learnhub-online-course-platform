'use client'

import { useState, useEffect } from 'react'

interface Shortcut {
  keys: string[]
  description: string
  action: () => void
}

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const [recentlyUsed, setRecentlyUsed] = useState<string | null>(null)

  const shortcuts: Shortcut[] = [
    { keys: ['/', '?'], description: 'Show keyboard shortcuts', action: () => setIsOpen(true) },
    { keys: ['G', 'H'], description: 'Go to Home', action: () => window.location.href = '/' },
    { keys: ['G', 'C'], description: 'Go to Courses', action: () => window.location.href = '/courses' },
    { keys: ['G', 'K'], description: 'Go to Categories', action: () => window.location.href = '/categories' },
    { keys: ['Esc'], description: 'Close dialogs', action: () => setIsOpen(false) },
  ]

  useEffect(() => {
    let keySequence: string[] = []
    let keyTimeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      clearTimeout(keyTimeout)
      
      const key = e.key.toUpperCase()
      keySequence.push(key)

      // Check for shortcuts
      if (key === '?' || key === '/') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        keySequence = []
        return
      }

      if (key === 'ESCAPE') {
        setIsOpen(false)
        keySequence = []
        return
      }

      // Check for G + letter combinations
      if (keySequence.length >= 2 && keySequence[keySequence.length - 2] === 'G') {
        const combo = keySequence.slice(-2).join('')
        
        if (combo === 'GH') {
          setRecentlyUsed('Home')
          setTimeout(() => window.location.href = '/', 300)
        } else if (combo === 'GC') {
          setRecentlyUsed('Courses')
          setTimeout(() => window.location.href = '/courses', 300)
        } else if (combo === 'GK') {
          setRecentlyUsed('Categories')
          setTimeout(() => window.location.href = '/categories', 300)
        }
        keySequence = []
      }

      // Reset sequence after 1 second
      keyTimeout = setTimeout(() => {
        keySequence = []
      }, 1000)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(keyTimeout)
    }
  }, [])

  // Show brief feedback when navigating
  useEffect(() => {
    if (recentlyUsed) {
      const timer = setTimeout(() => setRecentlyUsed(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [recentlyUsed])

  return (
    <>
      {/* Navigation feedback toast */}
      {recentlyUsed && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-primary-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="animate-spin">🚀</span>
            <span>Navigating to {recentlyUsed}...</span>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⌨️</span>
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg"
                >
                  <span className="text-navy-200">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, j) => (
                      <span key={j}>
                        <kbd className="px-2 py-1 bg-navy-700 border border-navy-600 rounded text-sm text-white font-mono">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="text-navy-500 mx-1">or</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-navy-400">
              Press <kbd className="px-2 py-0.5 bg-navy-800 rounded text-xs">?</kbd> anytime to toggle this menu
            </p>
          </div>
        </div>
      )}
    </>
  )
}