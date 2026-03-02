'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickAction {
  icon: string
  label: string
  href: string
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: '🎯', label: 'Continue Learning', href: '/courses', color: 'from-green-500 to-emerald-600' },
  { icon: '📚', label: 'Browse Courses', href: '/courses', color: 'from-blue-500 to-cyan-600' },
  { icon: '🏷️', label: 'Categories', href: '/categories', color: 'from-purple-500 to-violet-600' },
  { icon: '💬', label: 'Contact Us', href: '/contact', color: 'from-orange-500 to-amber-600' },
]

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 right-5 z-30">
      {/* Action Menu */}
      <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl p-2 shadow-xl shadow-navy-950/50 space-y-1">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-navy-800 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl shadow-lg`}>
                {action.icon}
              </span>
              <span className="text-white font-medium whitespace-nowrap group-hover:text-primary-400 transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary-500/50 ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label="Quick actions"
      >
        {isOpen ? '✕' : '⚡'}
      </button>
    </div>
  )
}