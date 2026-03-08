'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Shortcut {
  keys: string[]
  description: string
  action: () => void
}

export default function KeyboardShortcuts() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const router = useRouter()

  const showShortcutToast = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }, [])

  const shortcuts: Shortcut[] = [
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      action: () => setShowModal(true),
    },
    {
      keys: ['g', 'h'],
      description: 'Go to Home',
      action: () => {
        router.push('/')
        showShortcutToast('Navigating to Home')
      },
    },
    {
      keys: ['g', 'c'],
      description: 'Go to Courses',
      action: () => {
        router.push('/courses')
        showShortcutToast('Navigating to Courses')
      },
    },
    {
      keys: ['g', 'a'],
      description: 'Go to Categories',
      action: () => {
        router.push('/categories')
        showShortcutToast('Navigating to Categories')
      },
    },
    {
      keys: ['g', 'o'],
      description: 'Go to Contact',
      action: () => {
        router.push('/contact')
        showShortcutToast('Navigating to Contact')
      },
    },
    {
      keys: ['/'],
      description: 'Focus search (if available)',
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          showShortcutToast('Search focused')
        }
      },
    },
    {
      keys: ['Escape'],
      description: 'Close modal / Blur focus',
      action: () => {
        setShowModal(false)
        const activeElement = document.activeElement as HTMLElement
        if (activeElement) activeElement.blur()
      },
    },
  ]

  useEffect(() => {
    let keySequence: string[] = []
    let keyTimeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = e.key.toLowerCase()

      // Clear sequence after 1 second of inactivity
      clearTimeout(keyTimeout)
      keyTimeout = setTimeout(() => {
        keySequence = []
      }, 1000)

      // Add key to sequence
      keySequence.push(key)

      // Check for matching shortcuts
      for (const shortcut of shortcuts) {
        const shortcutKeys = shortcut.keys.map(k => k.toLowerCase())
        
        // Check if current sequence matches shortcut
        if (
          shortcutKeys.length === keySequence.length &&
          shortcutKeys.every((k, i) => k === keySequence[i])
        ) {
          e.preventDefault()
          shortcut.action()
          keySequence = []
          return
        }

        // Check if current sequence is start of a shortcut
        if (
          shortcutKeys.length > keySequence.length &&
          shortcutKeys.slice(0, keySequence.length).every((k, i) => k === keySequence[i])
        ) {
          // Partial match, continue waiting
          return
        }
      }

      // Check single-key shortcuts
      for (const shortcut of shortcuts) {
        if (shortcut.keys.length === 1 && shortcut.keys[0].toLowerCase() === key) {
          e.preventDefault()
          shortcut.action()
          keySequence = []
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(keyTimeout)
    }
  }, [shortcuts, showShortcutToast])

  return (
    <>
      {/* Keyboard Hint Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-5 w-10 h-10 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-lg flex items-center justify-center text-navy-400 hover:text-white transition-all duration-200 shadow-lg z-40 group"
        title="Keyboard shortcuts (?)"
      >
        <span className="text-sm font-mono">?</span>
        <span className="absolute -top-10 right-0 bg-navy-900 text-navy-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-navy-700">
          Keyboard shortcuts
        </span>
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-navy-800 border border-navy-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-primary-400">⌨️</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-navy-900 border border-navy-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⌨️</span> Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-navy-800 last:border-0"
                >
                  <span className="text-navy-300">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <span key={keyIndex} className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-navy-800 border border-navy-600 rounded text-sm font-mono text-white">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-navy-500 text-xs">then</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-navy-800">
              <p className="text-navy-500 text-sm text-center">
                Press <kbd className="px-1.5 py-0.5 bg-navy-800 border border-navy-600 rounded text-xs font-mono">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}