'use client'

import Link from 'next/link'
import { useState } from 'react'

interface QuickAction {
  icon: string
  title: string
  description: string
  href: string
  color: string
}

const actions: QuickAction[] = [
  {
    icon: '🎯',
    title: 'Start Learning',
    description: 'Dive into your first course',
    href: '/courses',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🔍',
    title: 'Explore Topics',
    description: 'Find your perfect subject',
    href: '/categories',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '👋',
    title: 'Get in Touch',
    description: 'Questions? We\'re here to help',
    href: '/contact',
    color: 'from-orange-500 to-red-500'
  },
]

export default function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Link
          key={action.title}
          href={action.href}
          className="group relative overflow-hidden rounded-2xl p-6 bg-navy-800/50 border border-navy-700/50 hover:border-transparent transition-all duration-300"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Gradient background on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />
          
          {/* Animated border gradient */}
          <div 
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            style={{ padding: '1px' }}
          >
            <div className="h-full w-full bg-navy-800 rounded-2xl" />
          </div>

          <div className="relative z-10 flex items-start gap-4">
            <div className={`text-3xl transition-transform duration-300 ${hoveredIndex === index ? 'scale-125 animate-bounce' : ''}`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                {action.title}
              </h3>
              <p className="text-navy-400 text-sm">
                {action.description}
              </p>
            </div>
            <svg 
              className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}