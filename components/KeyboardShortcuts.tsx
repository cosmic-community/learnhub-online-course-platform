'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Shortcut {
  key: string
  description: string
  action: () => void
}

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const shortcuts: Shortcut[] = [
    { key: 'g h', description: 'Go to Home', action: () => router.push('/') },
    { key: 'g c', description: 'Go to Courses', action: () => router.push('/courses') },
    { key: 'g a', description: 'Go to Categories', action: () => router.push('/categories') },
    { key: 'g o', description: 'Go to Contact', action: () => router.push('/contact') },
    { key: '/', description: 'Focus search (if available)', action: () => {} },
    { key: 'Esc', description: 'Close modal', action: () => setIsOpen(false) },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    // Toggle modal with ?
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault()
      setIsOpen(prev => !prev)
      return
    }

    // Close with Escape
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }

    // Handle 'g' prefix shortcuts
    if (e.key === 'g') {
      const handleSecondKey = (e2: KeyboardEvent) => {
        switch (e2.key) {
          case 'h':
            e2.preventDefault()
            router.push('/')
            break
          case 'c':
            e2.preventDefault()
            router.push('/courses')
            break
          case 'a':
            e2.preventDefault()
            router.push('/categories')
            break
          case 'o':
            e2.preventDefault()
            router.push('/contact')
            break
        }
        window.removeEventListener('keydown', handleSecondKey)
      }
      
      window.addEventListener('keydown', handleSecondKey, { once: true })
      setTimeout(() => {
        window.removeEventListener('keydown', handleSecondKey)
      }, 1000)
    }
  }, [router])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-navy-800 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut) => (
            <div 
              key={shortcut.key}
              className="flex items-center justify-between py-2"
            >
              <span className="text-navy-300">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.key.split(' ').map((key, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-navy-500 mx-1">then</span>}
                    <kbd className="px-2 py-1 bg-navy-800 border border-navy-700 rounded text-sm font-mono text-navy-200">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-700 bg-navy-800/50">
          <p className="text-sm text-navy-400 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-navy-700 rounded text-xs font-mono">?</kbd> anytime to show this menu
          </p>
        </div>
      </div>
    </div>
  )
}