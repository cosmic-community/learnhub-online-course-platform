'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'continue',
    title: 'Continue Learning',
    description: 'Pick up where you left off',
    icon: '▶️',
    href: '/courses',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400/50',
  },
  {
    id: 'explore',
    title: 'Explore New',
    description: 'Discover something different',
    icon: '🧭',
    href: '/categories',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400/50',
  },
  {
    id: 'challenge',
    title: 'Daily Challenge',
    description: 'Test your knowledge',
    icon: '⚡',
    href: '/courses',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-400/50',
  },
]

export default function QuickActions() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
      {QUICK_ACTIONS.map((action, index) => (
        <Link
          key={action.id}
          href={action.href}
          className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
          onMouseEnter={() => setHoveredAction(action.id)}
          onMouseLeave={() => setHoveredAction(null)}
        >
          {/* Animated background */}
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transition-transform duration-500 ${
              hoveredAction === action.id ? 'translate-x-0' : '-translate-x-full'
            }`}
          />
          
          <div className="relative flex items-start gap-4">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-primary-300 transition-colors">
                {action.title}
              </h3>
              <p className="text-navy-400 text-sm">
                {action.description}
              </p>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition-all duration-300 ${
            hoveredAction === action.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}>
            →
          </div>
        </Link>
      ))}
    </div>
  )
}