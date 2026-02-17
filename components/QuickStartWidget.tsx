'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function QuickStartWidget() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the widget before
    const dismissed = localStorage.getItem('quickstart-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show widget after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('quickstart-dismissed', 'true')
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-slide-up">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 shadow-2xl shadow-primary-500/30 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-4xl mb-3">🚀</div>
        <h3 className="text-white font-bold text-lg mb-2">New to LearnHub?</h3>
        <p className="text-white/90 text-sm mb-4">
          Start your learning journey with our free beginner courses. No credit card required!
        </p>
        
        <div className="flex gap-2">
          <Link
            href="/courses?difficulty=beginner"
            className="flex-1 bg-white text-primary-600 font-semibold py-2 px-4 rounded-lg text-center text-sm hover:bg-white/90 transition-colors"
            onClick={handleDismiss}
          >
            Start Free
          </Link>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 text-sm hover:text-white transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}