'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuickAction {
  icon: string
  label: string
  href: string
  color: string
  description: string
}

const quickActions: QuickAction[] = [
  {
    icon: '🚀',
    label: 'Start Learning',
    href: '/courses',
    color: 'from-primary-500 to-cyan-500',
    description: 'Browse all courses'
  },
  {
    icon: '🎯',
    label: 'Find Your Path',
    href: '/categories',
    color: 'from-purple-500 to-pink-500',
    description: 'Explore by category'
  },
  {
    icon: '👨‍🏫',
    label: 'Meet Experts',
    href: '/instructors/alex-thompson',
    color: 'from-amber-500 to-orange-500',
    description: 'Learn from pros'
  },
  {
    icon: '💬',
    label: 'Get in Touch',
    href: '/contact',
    color: 'from-green-500 to-emerald-500',
    description: 'We\'re here to help'
  }
]

export default function QuickStartCard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Link
            key={action.label}
            href={action.href}
            className="group relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={`
              relative overflow-hidden rounded-xl p-4 transition-all duration-300
              bg-navy-800/50 border border-navy-700
              hover:border-transparent hover:shadow-lg
              ${hoveredIndex === index ? 'scale-105' : 'scale-100'}
            `}>
              {/* Gradient Background on Hover */}
              <div 
                className={`
                  absolute inset-0 bg-gradient-to-br ${action.color} 
                  opacity-0 group-hover:opacity-20 transition-opacity duration-300
                `}
              />
              
              <div className="relative z-10">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <div className="font-medium text-white text-sm group-hover:text-primary-300 transition-colors">
                  {action.label}
                </div>
                <div className="text-xs text-navy-400 mt-1">
                  {action.description}
                </div>
              </div>
              
              {/* Arrow Icon */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}