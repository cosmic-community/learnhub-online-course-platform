'use client'

import Link from 'next/link'

const actions = [
  {
    icon: '🎯',
    title: 'Find Your Path',
    description: 'Take our quiz to find the perfect course',
    href: '/courses',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🆓',
    title: 'Free Courses',
    description: 'Start learning without any cost',
    href: '/courses?free=true',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '📱',
    title: 'Mobile Dev',
    description: 'Build apps for iOS & Android',
    href: '/categories/mobile-development',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '☁️',
    title: 'Cloud Skills',
    description: 'Master AWS, Azure & more',
    href: '/categories/cloud-computing',
    color: 'from-orange-500 to-red-500',
  },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="group relative overflow-hidden bg-navy-800/50 border border-navy-700/50 hover:border-navy-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
          
          <div className="relative">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-navy-400">
              {action.description}
            </p>
          </div>
          
          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}