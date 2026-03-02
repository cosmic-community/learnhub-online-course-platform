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
    { key: 'g t', description: 'Go to Categories', action: () => router.push('/categories') },
    { key: 'g o', description: 'Go to Contact', action: () => router.push('/contact') },
    { key: '/', description: 'Focus search (if available)', action: () => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
      if (searchInput) searchInput.focus()
    }},
    { key: 'Esc', description: 'Close modals/dialogs', action: () => setIsOpen(false) },
    { key: '?', description: 'Show keyboard shortcuts', action: () => setIsOpen(true) },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      setIsOpen(prev => !prev)
      return
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }

    // Handle 'g' prefix shortcuts
    if (e.key === 'g') {
      const handleSecondKey = (e2: KeyboardEvent) => {
        document.removeEventListener('keydown', handleSecondKey)
        
        if (e2.target instanceof HTMLInputElement || e2.target instanceof HTMLTextAreaElement) {
          return
        }

        switch (e2.key) {
          case 'h':
            e2.preventDefault()
            router.push('/')
            break
          case 'c':
            e2.preventDefault()
            router.push('/courses')
            break
          case 't':
            e2.preventDefault()
            router.push('/categories')
            break
          case 'o':
            e2.preventDefault()
            router.push('/contact')
            break
        }
      }

      setTimeout(() => {
        document.addEventListener('keydown', handleSecondKey, { once: true })
      }, 0)

      // Remove listener after 1 second if no second key pressed
      setTimeout(() => {
        document.removeEventListener('keydown', handleSecondKey)
      }, 1000)
    }

    if (e.key === '/') {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
      if (searchInput) {
        e.preventDefault()
        searchInput.focus()
      }
    }
  }, [router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-navy-900 border border-navy-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-navy-800 last:border-0">
              <span className="text-navy-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-navy-800 text-navy-200 rounded text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-navy-500 text-center">
          Press <kbd className="px-1 py-0.5 bg-navy-800 rounded text-navy-300">?</kbd> anytime to toggle this menu
        </p>
      </div>
    </div>
  )
}