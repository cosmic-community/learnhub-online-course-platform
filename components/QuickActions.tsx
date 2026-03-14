'use client'

import Link from 'next/link'
import { useState } from 'react'

interface QuickAction {
  title: string
  description: string
  icon: string
  href: string
  color: string
  hoverColor: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: 'Start Learning',
    description: 'Jump into a new course',
    icon: '🚀',
    href: '/courses',
    color: 'from-blue-500/20 to-blue-600/20',
    hoverColor: 'group-hover:from-blue-500/30 group-hover:to-blue-600/30',
  },
  {
    title: 'Explore Topics',
    description: 'Browse by category',
    icon: '🔍',
    href: '/categories',
    color: 'from-purple-500/20 to-purple-600/20',
    hoverColor: 'group-hover:from-purple-500/30 group-hover:to-purple-600/30',
  },
  {
    title: 'Meet Instructors',
    description: 'Learn from experts',
    icon: '👨‍🏫',
    href: '/instructors',
    color: 'from-green-500/20 to-green-600/20',
    hoverColor: 'group-hover:from-green-500/30 group-hover:to-green-600/30',
  },
  {
    title: 'Get Help',
    description: 'Contact support',
    icon: '💬',
    href: '/contact',
    color: 'from-orange-500/20 to-orange-600/20',
    hoverColor: 'group-hover:from-orange-500/30 group-hover:to-orange-600/30',
  },
]

export default function QuickActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {QUICK_ACTIONS.map((action, index) => (
        <Link
          key={action.title}
          href={action.href}
          className="group relative overflow-hidden rounded-xl border border-navy-700 hover:border-primary-500/50 transition-all duration-300"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} ${action.hoverColor} transition-all duration-300`} />
          
          <div className="relative p-5">
            <div 
              className={`text-4xl mb-3 transition-transform duration-300 ${
                hoveredIndex === index ? 'scale-110 -rotate-6' : ''
              }`}
            >
              {action.icon}
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-primary-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-navy-400 text-sm">{action.description}</p>
          </div>

          {/* Animated Arrow */}
          <div className={`absolute bottom-4 right-4 text-navy-500 transition-all duration-300 ${
            hoveredIndex === index ? 'translate-x-0 opacity-100 text-primary-400' : '-translate-x-2 opacity-0'
          }`}>
            →
          </div>
        </Link>
      ))}
    </div>
  )
}